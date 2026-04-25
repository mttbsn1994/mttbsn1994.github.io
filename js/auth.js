/* ============================================================
   Verion Research — Auth (client-side session gate)
   Password modificabile nella variabile VR_PWD_HASH.
   Cambia la password: sostituisci il valore di VR_PWD_HASH
   con btoa('nuova-password') eseguito in console.
   ============================================================ */

const VR_AUTH = (() => {

  // btoa('verion2025') — per cambiare password sostituisci questo valore
  const VR_PWD_HASH = 'dmVyaW9uMjAyNQ==';
  const SESSION_KEY  = 'vr_session';
  const REDIRECT_KEY = 'vr_redirect';

  function isAuthenticated() {
    return sessionStorage.getItem(SESSION_KEY) === VR_PWD_HASH;
  }

  function login(password) {
    if (btoa(password) === VR_PWD_HASH) {
      sessionStorage.setItem(SESSION_KEY, VR_PWD_HASH);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = '/index.html';
  }

  /* Chiamata all'inizio di ogni pagina privata.
     Se non autenticato, salva l'URL corrente e manda al login. */
  function requireAuth() {
    if (!isAuthenticated()) {
      sessionStorage.setItem(REDIRECT_KEY, window.location.href);
      window.location.href = '/login.html';
    }
  }

  /* Dopo login riuscito, torna alla pagina richiesta (o a /private/research.html) */
  function redirectAfterLogin() {
    const dest = sessionStorage.getItem(REDIRECT_KEY) || '/private/research.html';
    sessionStorage.removeItem(REDIRECT_KEY);
    window.location.href = dest;
  }

  return { isAuthenticated, login, logout, requireAuth, redirectAfterLogin };
})();
