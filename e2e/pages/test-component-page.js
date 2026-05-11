export class TestComponentPage {
  page;
  angularVersion;

  constructor(page) {
    this.page = page;
    this.angularVersion = page.getByTestId("angular-version");
  }
}
