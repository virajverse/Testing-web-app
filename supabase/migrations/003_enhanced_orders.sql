-- Enhanced Order System for Taliyo Marketplace
-- Run this in Supabase SQL Editor

-- Create enhanced orders table
CREATE TABLE enhanced_orders (
  id SERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL, -- TLY001, TLY002, etc.
  
  -- Customer Information
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_whatsapp TEXT,
  
  -- Service Information
  service_id INTEGER REFERENCES services(id),
  service_name TEXT NOT NULL,
  service_price INTEGER,
  
  -- Order Details
  requirements TEXT NOT NULL, -- What customer wants
  budget_range TEXT, -- "5k-10k", "10k-20k", "flexible"
  delivery_preference TEXT, -- "ASAP", "1 week", "2 weeks", "1 month"
  additional_notes TEXT,
  
  -- File Attachments
  attachment_files JSONB, -- Array of file objects with name, url, type, size
  
  -- Status & Tracking
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'contacted', 'in_progress', 'review', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Communication Tracking
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contacted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_enhanced_orders_order_id ON enhanced_orders(order_id);
CREATE INDEX idx_enhanced_orders_status ON enhanced_orders(status);
CREATE INDEX idx_enhanced_orders_created_at ON enhanced_orders(created_at DESC);
CREATE INDEX idx_enhanced_orders_customer_phone ON enhanced_orders(customer_phone);

-- Function to generate unique order ID
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    counter INTEGER;
BEGIN
    -- Get the count of existing orders and add 1
    SELECT COUNT(*) + 1 INTO counter FROM enhanced_orders;
    
    -- Format as TLY001, TLY002, etc.
    new_id := 'TLY' || LPAD(counter::TEXT, 3, '0');
    
    -- Check if ID already exists (safety check)
    WHILE EXISTS (SELECT 1 FROM enhanced_orders WHERE order_id = new_id) LOOP
        counter := counter + 1;
        new_id := 'TLY' || LPAD(counter::TEXT, 3, '0');
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order ID
CREATE OR REPLACE FUNCTION set_order_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
        NEW.order_id := generate_order_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_id
    BEFORE INSERT ON enhanced_orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_id();

-- Trigger for updated_at timestamp
CREATE TRIGGER update_enhanced_orders_updated_at 
    BEFORE UPDATE ON enhanced_orders
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE enhanced_orders ENABLE ROW LEVEL SECURITY;

-- Policies for enhanced_orders
CREATE POLICY "Public can insert orders" ON enhanced_orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view own orders" ON enhanced_orders
    FOR SELECT USING (true); -- For now, allow all reads

CREATE POLICY "Admin can manage all orders" ON enhanced_orders
    FOR ALL USING (true); -- Update this with proper admin auth later

-- Create order status history table (optional - for tracking status changes)
CREATE TABLE order_status_history (
  id SERIAL PRIMARY KEY,
  order_id TEXT REFERENCES enhanced_orders(order_id),
  old_status TEXT,
  new_status TEXT,
  changed_by TEXT, -- admin email or system
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes)
        VALUES (NEW.order_id, OLD.status, NEW.status, 'system', 'Status updated');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_status_change
    AFTER UPDATE ON enhanced_orders
    FOR EACH ROW
    EXECUTE FUNCTION log_status_change();