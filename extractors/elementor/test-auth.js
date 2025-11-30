const username = "harold-3e1dad";
const password = "zXWf pY89 WlOD 6jGh 2hvZ HvXY";
const credentials = Buffer.from(`${username}:${password}`).toString('base64');

console.log("Base64 credentials:", credentials);

fetch("https://www.barbudaleisure.com/wp-json/wp/v2/pages?per_page=1", {
  headers: {
    "Authorization": `Basic ${credentials}`,
    "Accept": "application/json"
  }
})
.then(res => {
  console.log("Status:", res.status);
  console.log("OK:", res.ok);
  return res.json();
})
.then(data => {
  console.log("Success! Found", data.length, "pages");
  if (data.length > 0) {
    console.log("First page:", data[0].id, data[0].title.rendered);
  }
})
.catch(err => console.error("Error:", err.message));
