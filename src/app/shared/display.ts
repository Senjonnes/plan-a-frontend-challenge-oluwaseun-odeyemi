import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable()

export class Display {
    alert;
    loading;
    modal;
    constructor(
        public loaderCtrl: LoadingController,
        public toastCtrl: ToastController,
    ) { }

    async loader() {
        this.loading = await this.loaderCtrl.create({
            mode: "ios"
        });
        await this.loading.present();
    }

    async removeLoader() {
        return await this.loading.dismiss();
    }

    async dismissAllLoaders() {
        let topLoader = await this.loaderCtrl.getTop();
        while (topLoader) {
            if (!(await topLoader.dismiss())) {
                return;
            }
            topLoader = await this.loaderCtrl.getTop();
        }
    }

    async showSuccessToaster(msg) {
        let toast = await this.toastCtrl.create({
            message: msg,
            duration: 5000,
            position: "top",
            mode: "ios",
            cssClass: "success-toast-scheme",
            buttons: [
                {
                    side: 'end',
                    text: 'x',
                    role: 'cancel',
                    handler: () => {
                        console.log('');
                    }
                }
            ]
        });
        toast.present()
    }

    async showErrorToaster(msg) {
        let toast = await this.toastCtrl.create({
            message: msg,
            duration: 5000,
            position: "top",
            mode: "ios",
            cssClass: "error-toast-scheme",
            buttons: [
                {
                    side: 'end',
                    text: 'x',
                    role: 'cancel',
                    handler: () => {
                        console.log('');
                    }
                }
            ]
        });
        toast.present()
    }
}