CREATE OR REPLACE FUNCTION idpurchase_transaction() RETURNS TEST AS $$
    BEGIN
        RETURN 'PRT-' || nextval('idpurchase_transaction_seq');
    END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION update_sale_transaction() RETURNS TRIGGER AS $set_sale_transaction$
    DECLARE
        stock_lama INTEGER;
        sum_price NUMERIC;
    BEGIN
        IF (TG_OP = 'INSERT') THEN
        --insert stock
            SELECT stock INTO stock_lama FROM product_variant WHERE idvariant = NEW.idvariant;
            UPDATE product_variant SET stock = stock_lama - NEW.qty WHERE idvariant = NEW.idvariant;

        ELSIF (TG_OP = 'UPDATE') THEN
        --update stock
            SELECT stock INTO stock_lama from product_variant WHERE idvariant = NEW.idvariant;
            UPDATE product_variant SET stock = stock_lama + OLD.qty - NEW.qty WHERE idvariant = NEW.idvariant;

        ELSIF (TG_OP = 'DELETE') THEN
        --update stock
            SELECT stock INTO stock_lama FROM product_variant WHERE idvariant = NEW.idvariant;
            UPDATE product_variant SET stock = stock_lama + NEW.qty WHERE idvariant = NEW.idvariant;

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
        SELECT price INTO product_price FROM product_variant WHERE idvariant = NEW.idvariant;
        NEW.price := product_price;
        NEW.total_price := NEW.qty * product_price;
        RETURN NEW;
    END;
$set_total_price$ LANGUAGE plpgsql;

CREATE TRIGGER set_total_price
BEFORE INSERT OR UPDATE OR DELETE ON sale_detail
    FOR EACH ROW EXECUTE FUNCTION update_price(); 




!------PURCHASE------
CREATE OR REPLACE FUNCTION update_purchase_transaction() RETURNS TRIGGER AS $set_purchase_transaction$
    DECLARE
        stock_lama INTEGER;
        sum_price NUMERIC;
    BEGIN
        IF (TG_OP = 'INSERT') THEN
        --insert stock
            SELECT stock INTO stock_lama FROM product_variant WHERE idvariant = NEW.idvariant;
            UPDATE product_variant SET stock = stock_lama + NEW.qty WHERE idvariant = NEW.idvariant;

        ELSIF (TG_OP = 'UPDATE') THEN
        --update stock
            SELECT stock INTO stock_lama from product_variant WHERE idvariant = NEW.idvariant;
            UPDATE product_variant SET stock = stock_lama - OLD.qty + NEW.qty WHERE idvariant = NEW.idvariant;

        ELSIF (TG_OP = 'DELETE') THEN
        --update stock
            SELECT stock INTO stock_lama FROM product_variant WHERE idvariant = NEW.idvariant;
            UPDATE product_variant SET stock = stock_lama - NEW.qty WHERE idvariant = NEW.idvariant;

        END IF;
        --update penjualan
            SELECT sum(total_price) INTO sum_price FROM purchase_detail WHERE no_invoice = NEW.no_invoice;
            UPDATE purchase_transaction SET total_price = sum_price WHERE no_invoice = NEW.no_invoice;
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$set_purchase_transaction$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchase_transaction
AFTER INSERT OR UPDATE OR DELETE ON purchase_detail
    FOR EACH ROW EXECUTE FUNCTION update_purchase_transaction(); 

    --update total harga
CREATE OR REPLACE FUNCTION update_price2() RETURNS TRIGGER AS $set_total_price$
    DECLARE
        product_price NUMERIC;
    BEGIN
        SELECT supplier_price INTO product_price FROM product_variant WHERE idvariant = NEW.idvariant;
        NEW.supplier_price := product_price;
        NEW.total_price := NEW.qty * product_price;
        RETURN NEW;
    END;
$set_total_price$ LANGUAGE plpgsql;

CREATE TRIGGER set_total_price
BEFORE INSERT OR UPDATE OR DELETE ON purchase_detail
    FOR EACH ROW EXECUTE FUNCTION update_price2(); 


