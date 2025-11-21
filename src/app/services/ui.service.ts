import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

export interface AlertButton {
  text: string;
  role?: 'cancel' | 'destructive' | string;
  handler?: () => void | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  /**
   * Menampilkan toast notification
   * @param message - Pesan yang akan ditampilkan
   * @param color - Warna toast (success, warning, danger, primary, etc)
   * @param duration - Durasi dalam milliseconds (default: 2000)
   * @param position - Posisi toast (top, bottom, middle)
   */
  async showToast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'primary' | 'secondary' = 'success',
    duration: number = 2000,
    position: 'top' | 'bottom' | 'middle' = 'bottom'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position,
      buttons: [
        {
          text: 'Tutup',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Menampilkan toast sukses
   * @param message - Pesan yang akan ditampilkan
   */
  async showSuccessToast(message: string): Promise<void> {
    await this.showToast(message, 'success');
  }

  /**
   * Menampilkan toast error
   * @param message - Pesan yang akan ditampilkan
   */
  async showErrorToast(message: string): Promise<void> {
    await this.showToast(message, 'danger', 3000);
  }

  /**
   * Menampilkan toast warning
   * @param message - Pesan yang akan ditampilkan
   */
  async showWarningToast(message: string): Promise<void> {
    await this.showToast(message, 'warning');
  }

  /**
   * Menampilkan alert dialog
   * @param header - Judul alert
   * @param message - Pesan alert
   * @param buttons - Array tombol atau teks tunggal
   */
  async showAlert(
    header: string,
    message: string,
    buttons: AlertButton[] | string[] = ['OK']
  ): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: buttons as any
    });
    await alert.present();
  }

  /**
   * Menampilkan alert konfirmasi dengan callback
   * @param header - Judul alert
   * @param message - Pesan alert
   * @param confirmText - Teks tombol konfirmasi
   * @param cancelText - Teks tombol batal
   * @param onConfirm - Callback ketika dikonfirmasi
   */
  async showConfirmAlert(
    header: string,
    message: string,
    confirmText: string = 'Ya',
    cancelText: string = 'Tidak',
    onConfirm?: () => void | Promise<void>
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: confirmText,
            role: 'confirm',
            handler: async () => {
              if (onConfirm) {
                await onConfirm();
              }
              resolve(true);
            }
          }
        ]
      });
      await alert.present();
    });
  }

  /**
   * Menampilkan alert konfirmasi destructive (untuk aksi berbahaya seperti hapus)
   * @param header - Judul alert
   * @param message - Pesan alert
   * @param confirmText - Teks tombol konfirmasi
   * @param cancelText - Teks tombol batal
   * @param onConfirm - Callback ketika dikonfirmasi
   */
  async showDestructiveAlert(
    header: string,
    message: string,
    confirmText: string = 'Hapus',
    cancelText: string = 'Batal',
    onConfirm?: () => void | Promise<void>
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: confirmText,
            role: 'destructive',
            handler: async () => {
              if (onConfirm) {
                await onConfirm();
              }
              resolve(true);
            }
          }
        ]
      });
      await alert.present();
    });
  }

  /**
   * Menampilkan alert dengan input field
   * @param header - Judul alert
   * @param message - Pesan alert
   * @param placeholder - Placeholder untuk input
   * @param inputType - Tipe input (text, email, password, etc)
   * @param confirmText - Teks tombol konfirmasi
   * @param cancelText - Teks tombol batal
   */
  async showInputAlert(
    header: string,
    message: string,
    placeholder: string = '',
    inputType: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text',
    confirmText: string = 'OK',
    cancelText: string = 'Batal'
  ): Promise<string | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        inputs: [
          {
            type: inputType,
            placeholder
          }
        ],
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => {
              resolve(null);
            }
          },
          {
            text: confirmText,
            handler: (data) => {
              resolve(data[0] || null);
            }
          }
        ]
      });
      await alert.present();
    });
  }

  /**
   * Menampilkan loading spinner
   * @param message - Pesan loading
   * @param duration - Durasi maksimal (0 = unlimited)
   */
  async showLoading(message: string = 'Memuat...', duration: number = 0): Promise<void> {
    this.loading = await this.loadingController.create({
      message,
      duration: duration > 0 ? duration : undefined,
      spinner: 'crescent'
    });
    await this.loading.present();
  }

  /**
   * Menyembunyikan loading spinner
   */
  async hideLoading(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  /**
   * Menjalankan fungsi dengan loading spinner
   * @param fn - Fungsi async yang akan dijalankan
   * @param loadingMessage - Pesan loading
   */
  async withLoading<T>(
    fn: () => Promise<T>,
    loadingMessage: string = 'Memuat...'
  ): Promise<T> {
    await this.showLoading(loadingMessage);
    try {
      const result = await fn();
      return result;
    } finally {
      await this.hideLoading();
    }
  }

  /**
   * Dismiss semua overlay yang terbuka (alert, toast, loading)
   */
  async dismissAll(): Promise<void> {
    await this.alertController.dismiss();
    await this.toastController.dismiss();
    await this.loadingController.dismiss();
  }
}
