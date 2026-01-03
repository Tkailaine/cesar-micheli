// seo.js
const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");

// URL base do seu site
const hostname = "https://cesarmicheli.com.br/";

// Cria o stream do sitemap
const sitemapStream = new SitemapStream({ hostname });

// Adiciona as páginas
sitemapStream.write({ url: "/", changefreq: "daily", priority: 1.0 });

// Finaliza o stream
sitemapStream.end();

// Converte o stream em string e salva no arquivo
streamToPromise(sitemapStream).then((data) => {
  fs.writeFileSync("sitemap.xml", data.toString());
  console.log("✅ sitemap.xml criado com sucesso!");
});

// Gera robots.txt também
const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${hostname}/sitemap.xml
`;

fs.writeFileSync("robots.txt", robotsTxt);
console.log("✅ robots.txt criado com sucesso!");
