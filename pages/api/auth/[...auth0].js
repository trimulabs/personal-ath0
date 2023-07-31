import {
  handleAuth,
  handleCallback,
  handleLogin,
  handleProfile,
} from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        returnTo: req.headers.referer,
      });
    } catch (err) {
      res.status(err.status ?? 500).end(err?.message);
    }
  },

  async profile(req, res) {
    try {
      await handleProfile(req, res, {
        refetch: true, // only if on SSR
      });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },

  async callback(req, res) {
    try {
      await handleCallback(req, res);
    } catch (error) {
      if (
        error.message === 'Invalid state' ||
        error.message === 'checks.state argument is missing' ||
        error.message === 'invalid_grant (Failed to verify code verifier)'
      ) {
        res
          .status(error.status || 500)
          .end(
            `Oops, it looks like there was an error.\nPlease log in again to continue.`
          );
      } else {
        res.status(error.status || 500).end(error.message);
      }
    }
  },
});
