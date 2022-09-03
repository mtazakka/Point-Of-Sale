CREATE OR REPLACE FUNCTION idsupplier() RETURNS text AS $$
        BEGIN
                RETURN 'INV-' || nextval('idcostumer_seq');
        END;
$$ LANGUAGE plpgsql;
