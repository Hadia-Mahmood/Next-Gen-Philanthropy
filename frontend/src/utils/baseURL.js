const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
let apiUrl;
if (environment === "PRODUCTION") {
  apiUrl = process.env.NEXT_PUBLIC_PRODUCTION_URL;
} else {
  apiUrl = process.env.NEXT_PUBLIC_DEVELOPMENT_URL;
}

export default apiUrl;
