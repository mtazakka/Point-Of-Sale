CREATE OR REPLACE FUNCTION update_sale_transaction() RETURNS TRIGGER AS $set_sale_transaction$
    DECLARE
        stock_lama INTEGER;
        sum_price NUMERIC;
    BEGIN
        IF (TG_OP = 'INSERT') THEN
        --insert stock
            SELECT stock INTO stock_lama FROM product_variant WHERE id = NEW.id;
            UPDATE product_variant SET stock = stock_lama - NEW.qty WHERE id = NEW.id; 

        ELSIF (TG_OP = 'UPDATE') THEN
        --update stock
            SELECT stock INTO stock_lama from product_variant WHERE id = NEW.id;
            UPDATE product_variant SET stock = stock_lama + OLD.qty - NEW.qty WHERE id = NEW.id;

        ELSIF (TG_OP = 'DELETE') THEN
        --update stock
            SELECT stock INTO stock_lama FROM product_variant WHERE id = NEW.id;
            UPDATE product_variant SET stock = stock_lama + NEW.qty WHERE id = NEW.id;

        END IF;
        --update penjualan
            SELECT sum(total_price) INTO sum_price FROM sale_detail WHERE no_invoice = NEW.no_invoice;
            UPDATE sale_transaction SET total_price = sum_price WHERE no_invoice = NEW.no_invoice;
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$set_sale_transaction$ LANGUAGE plpgsql;

CREATE TRIGGER set_sale_transaction
AFTER INSERT OR UPDATE OR DELETE ON sale_detail
    FOR EACH ROW EXECUTE FUNCTION update_sale_transaction(); 

    --update total harga
CREATE OR REPLACE FUNCTION update_price() RETURNS TRIGGER AS $set_total_price$
    DECLARE
        product_price NUMERIC;
    BEGIN
        SELECT price INTO product_price FROM product_variant WHERE id = NEW.id;
        NEW.price := product_price;
        NEW.total_price := NEW.qty * product_price;
        RETURN NEW;
    END;
$set_total_price$ LANGUAGE plpgsql;

CREATE TRIGGER set_total_price
BEFORE INSERT OR UPDATE OR DELETE ON sale_detail
    FOR EACH ROW EXECUTE FUNCTION update_price(); 



