import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private menuCtrl: MenuController,
    private router: Router,
    private auth: AuthService,
  ) { }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    this.menuCtrl.enable(true, 'home-menu');
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(false, 'home-menu');
  }

  toggleMenu(m) {
    this.menuCtrl.toggle('home-menu');
    if (m && m.url === '/home') {
      this.router.navigate([m.url]);
    } else if (m && m.url) {
      this.router.navigate([m.url]);
    }
  }

  async logout() {
    this.menuCtrl.toggle('home-menu');
    await this.auth.logout();
  }

}
