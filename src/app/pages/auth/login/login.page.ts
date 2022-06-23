import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Display } from 'src/app/shared/display';
import { Forms } from 'src/app/shared/forms';
import { Handlers } from 'src/app/shared/handlers';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  constructor(
    private router: Router,
    private forms: Forms,
    private handlers: Handlers,
    private auth: AuthService,
    private display: Display
  ) { }

  async login() {
    await this.display.loader();
    await this.auth.authenticate(this.form.value).then(async res => {
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    }, async err => {
      this.display.showErrorToaster(err?.error?.status_message ?? "An error has occured");
      await this.display.removeLoader();
    });
  }

  ngOnInit() {
    this.form = this.forms.Login();
  }

  isInvalid(name: string) {
    return (
      (this.form.get(name)?.touched || this.submitted) &&
      this.form.get(name)?.invalid
    );
  }

  getErrorMessage(name: any, value: string) {
    return this.handlers.getErrorMessage(name, value);
  }

}