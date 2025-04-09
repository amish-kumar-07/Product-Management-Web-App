require("dotenv").config();

/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: "./drizzle/schema.js", 
  out: "./drizzle",             
  dialect: "postgresql",         
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_BYGOF5Ihor9L@ep-rapid-tooth-a507mxyg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
  }
  ,
};
