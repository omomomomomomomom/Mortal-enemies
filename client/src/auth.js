import React from 'react'

function Auth({signInWithGoogle}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <button class="login-with-google-btn" onClick={signInWithGoogle}>
        Sign in with Google
    </button>
    </div>

  )
}

export default Auth