//Mock data för användaren
const users = [
  { username: "user", password: "password" },
  { username: "admin", password: "admin123" },
];

//Mock data inloggingsfunktion
export const mockLogin = (username, password) => {
  //sök efter en användare med matcjade användarnamn och lösenord
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  //returera en token om användaren finns, annars returera null
  if (user) {
    return "sample-token";
  } else {
    return null;
  }
};
