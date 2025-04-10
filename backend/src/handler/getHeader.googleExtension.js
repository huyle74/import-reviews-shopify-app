const { query } = require("../utils/db");

async function headerFromExtension(headers, shop_id) {
  try {
    const result = await query("SELECT EXISTS(SELECT 1 FROM shops WHERE shop_id = $1)", [shop_id]);
    const exists = result.rows[0].exists;
    if (!exists) {
      await query(`UPDATE shops SET headers = $1 WHERE shop_id = $2`, [headers, shop_id]);
      console.log(`-----DONE ADD NEW HEADERS COOKIE: shop ${shop_id} -----`);
    }
  } catch (error) {
    console.error("GET HEADER FROM GOOGLE EXTENSION BUG HERE >>>> ", error);
    res.status(404).json({ ERROR: "cannot get header cookies" });
  }
}
module.exports = headerFromExtension;
