export class User {
  constructor(
    public id: number,
    public email: string,
    public _accessToken: string,
    public _refreshToken: string,
    public _tokenExpirationDate: Date
  ) {}
}
