import { serialize } from 'cookie';
import { HttpResponse } from '../../shared/types';
import { CookieHelper, ICookieData } from '../../shared/abstractions/cookie-helper';

export class CookieHelperImpl implements CookieHelper {
  private COOKIE_HEADER = 'Set-Cookie';

  set(res: HttpResponse, cookieData: ICookieData[]) {
    res.setHeader(
      this.COOKIE_HEADER,
      cookieData.map(cookie => {
        if (!cookie.name) throw new Error('Cookie name is missing.');

        return serialize(cookie.name, cookie.value, {
          path: '/',
          secure: true, //set true so it can only be sent over HTTPS.
          httpOnly: true, //to prevent JavaScript from reading it
          sameSite: 'none', //to prevent CSRF
          ...(cookie.expiryPeriodInMin && { maxAge: cookie.expiryPeriodInMin * 60 }),
        });
      })
    );
  }

  clear(res: HttpResponse, cookieNames: string[]) {
    cookieNames.forEach(cookieName => res.clearCookie(cookieName));
  }
}
