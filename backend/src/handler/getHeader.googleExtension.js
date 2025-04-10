const { query } = require("../utils/db");

async function headerFromExtension(headers, shop_id) {
  try {
    const addShop = await query(
      `INSERT INTO shops (shop_id, headers)
          VALUES ($1, $2)
          ON CONFLICT (shop_id)
          DO UPDATE SET headers = EXCLUDED.headers
        RETURNING *;`,
      [shop_id, headers]
    );
    if (addShop.rows.length > 0) {
      console.log("Shop added successfully:", addShop.rows[0]);
    }
    console.log(`-----DONE ADD NEW HEADERS COOKIE: shop ${shop_id} -----`);
  } catch (error) {
    console.error("GET HEADER FROM GOOGLE EXTENSION BUG HERE >>>> ", error);
    res.status(404).json({ ERROR: "cannot get header cookies" });
  }
}
module.exports = headerFromExtension;
