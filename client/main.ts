// Replace these with the actual values used in your backend
// import crypto from 'crypto'
// function getGoogleOAuthURL() {
//   const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

//   const options = {
//     redirect_uri: process.env.REDIRECT_URI as string,
//     client_id: process.env.GOOGLE_CLIENT_ID as string,
//     access_type: "offline",
//     response_type: "code",
//     prompt: "consent",
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.profile",
//       "https://www.googleapis.com/auth/userinfo.email",
//     ].join(" "),
//   };

//   const qs = new URLSearchParams(options);

//   return `${rootUrl}?${qs.toString()}`;
// }

// document.getElementById("google-login")?.addEventListener("click", () => {
//   const url = getGoogleOAuthURL();
//   window.location.href = url;
// });

