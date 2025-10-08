import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

// CORS middleware for development
app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (c.req.method === "OPTIONS") {
    return c.text("", 200);
  }
  
  await next();
});

// Auth endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Admin API Routes - Protected
const ServiceSchema = z.object({
  name_en: z.string().min(1),
  name_hi: z.string().min(1),
  price: z.number().positive(),
  delivery_time: z.number().positive(),
  short_desc_en: z.string().optional(),
  short_desc_hi: z.string().optional(),
  full_desc_en: z.string().optional(),
  full_desc_hi: z.string().optional(),
  features_en: z.string().optional(),
  features_hi: z.string().optional(),
  image_url: z.string().url().optional(),
  category_id: z.number().positive(),
  is_active: z.boolean().default(true)
});

const CategorySchema = z.object({
  name_en: z.string().min(1),
  name_hi: z.string().min(1),
  slug: z.string().min(1)
});

const OrderSchema = z.object({
  client_name: z.string().min(1),
  whatsapp: z.string().min(1),
  service_id: z.number().positive(),
  status: z.string().default('contacted'),
  notes: z.string().optional()
});

// Dashboard Stats
app.get("/api/admin/dashboard", authMiddleware, async (c) => {
  const servicesCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM services").first();
  const categoriesCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM categories").first();
  const ordersCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM orders").first();
  const recentOrders = await c.env.DB.prepare(
    `SELECT o.*, s.name_en as service_name 
     FROM orders o 
     JOIN services s ON o.service_id = s.id 
     ORDER BY o.created_at DESC 
     LIMIT 5`
  ).all();

  return c.json({
    stats: {
      services: servicesCount?.count || 0,
      categories: categoriesCount?.count || 0,
      orders: ordersCount?.count || 0
    },
    recentOrders: recentOrders.results || []
  });
});

// Categories CRUD
app.get("/api/admin/categories", authMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM categories ORDER BY created_at DESC").all();
  return c.json(results);
});

app.post("/api/admin/categories", authMiddleware, zValidator("json", CategorySchema), async (c) => {
  const data = c.req.valid("json");
  
  const result = await c.env.DB.prepare(
    "INSERT INTO categories (name_en, name_hi, slug) VALUES (?, ?, ?)"
  ).bind(data.name_en, data.name_hi, data.slug).run();

  if (result.success) {
    const category = await c.env.DB.prepare("SELECT * FROM categories WHERE id = ?").bind(result.meta.last_row_id).first();
    return c.json(category, 201);
  }
  
  return c.json({ error: "Failed to create category" }, 500);
});

app.put("/api/admin/categories/:id", authMiddleware, zValidator("json", CategorySchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  const result = await c.env.DB.prepare(
    "UPDATE categories SET name_en = ?, name_hi = ?, slug = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(data.name_en, data.name_hi, data.slug, id).run();

  if (result.success) {
    const category = await c.env.DB.prepare("SELECT * FROM categories WHERE id = ?").bind(id).first();
    return c.json(category);
  }
  
  return c.json({ error: "Failed to update category" }, 500);
});

app.delete("/api/admin/categories/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  
  // Check if category has services
  const servicesCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM services WHERE category_id = ?").bind(id).first();
  
  if (servicesCount && (servicesCount.count as number) > 0) {
    return c.json({ error: "Cannot delete category with existing services" }, 400);
  }
  
  const result = await c.env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
  
  if (result.success) {
    return c.json({ success: true });
  }
  
  return c.json({ error: "Failed to delete category" }, 500);
});

// Services CRUD
app.get("/api/admin/services", authMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT s.*, c.name_en as category_name 
     FROM services s 
     JOIN categories c ON s.category_id = c.id 
     ORDER BY s.created_at DESC`
  ).all();
  return c.json(results);
});

app.post("/api/admin/services", authMiddleware, zValidator("json", ServiceSchema), async (c) => {
  const data = c.req.valid("json");
  
  const result = await c.env.DB.prepare(
    `INSERT INTO services (name_en, name_hi, price, delivery_time, short_desc_en, short_desc_hi, 
     full_desc_en, full_desc_hi, features_en, features_hi, image_url, category_id, is_active) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    data.name_en, data.name_hi, data.price, data.delivery_time,
    data.short_desc_en || null, data.short_desc_hi || null,
    data.full_desc_en || null, data.full_desc_hi || null,
    data.features_en || null, data.features_hi || null,
    data.image_url || null, data.category_id, data.is_active
  ).run();

  if (result.success) {
    const service = await c.env.DB.prepare("SELECT * FROM services WHERE id = ?").bind(result.meta.last_row_id).first();
    return c.json(service, 201);
  }
  
  return c.json({ error: "Failed to create service" }, 500);
});

app.put("/api/admin/services/:id", authMiddleware, zValidator("json", ServiceSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  const result = await c.env.DB.prepare(
    `UPDATE services SET name_en = ?, name_hi = ?, price = ?, delivery_time = ?, 
     short_desc_en = ?, short_desc_hi = ?, full_desc_en = ?, full_desc_hi = ?, 
     features_en = ?, features_hi = ?, image_url = ?, category_id = ?, is_active = ?, 
     updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(
    data.name_en, data.name_hi, data.price, data.delivery_time,
    data.short_desc_en || null, data.short_desc_hi || null,
    data.full_desc_en || null, data.full_desc_hi || null,
    data.features_en || null, data.features_hi || null,
    data.image_url || null, data.category_id, data.is_active, id
  ).run();

  if (result.success) {
    const service = await c.env.DB.prepare("SELECT * FROM services WHERE id = ?").bind(id).first();
    return c.json(service);
  }
  
  return c.json({ error: "Failed to update service" }, 500);
});

app.delete("/api/admin/services/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  
  const result = await c.env.DB.prepare("DELETE FROM services WHERE id = ?").bind(id).run();
  
  if (result.success) {
    return c.json({ success: true });
  }
  
  return c.json({ error: "Failed to delete service" }, 500);
});

// Orders CRUD
app.get("/api/admin/orders", authMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT o.*, s.name_en as service_name, s.price as service_price
     FROM orders o 
     JOIN services s ON o.service_id = s.id 
     ORDER BY o.created_at DESC`
  ).all();
  return c.json(results);
});

app.post("/api/admin/orders", authMiddleware, zValidator("json", OrderSchema), async (c) => {
  const data = c.req.valid("json");
  
  const result = await c.env.DB.prepare(
    "INSERT INTO orders (client_name, whatsapp, service_id, status, notes) VALUES (?, ?, ?, ?, ?)"
  ).bind(data.client_name, data.whatsapp, data.service_id, data.status, data.notes || null).run();

  if (result.success) {
    const order = await c.env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(result.meta.last_row_id).first();
    return c.json(order, 201);
  }
  
  return c.json({ error: "Failed to create order" }, 500);
});

app.put("/api/admin/orders/:id", authMiddleware, zValidator("json", OrderSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  const result = await c.env.DB.prepare(
    "UPDATE orders SET client_name = ?, whatsapp = ?, service_id = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(data.client_name, data.whatsapp, data.service_id, data.status, data.notes || null, id).run();

  if (result.success) {
    const order = await c.env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
    return c.json(order);
  }
  
  return c.json({ error: "Failed to update order" }, 500);
});

app.delete("/api/admin/orders/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  
  const result = await c.env.DB.prepare("DELETE FROM orders WHERE id = ?").bind(id).run();
  
  if (result.success) {
    return c.json({ success: true });
  }
  
  return c.json({ error: "Failed to delete order" }, 500);
});

export default app;
