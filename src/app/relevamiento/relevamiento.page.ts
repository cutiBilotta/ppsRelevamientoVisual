import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/compat/storage';
import { StorageService } from '../services/storage.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import Swal from 'sweetalert2'



@Component({
  selector: 'app-relevamiento',
  templateUrl: './relevamiento.page.html',
  styleUrls: ['./relevamiento.page.scss'],
})
export class RelevamientoPage implements OnInit {

  public usuario: string | null = null;
  public dato: any;
  public imagenes: any[] | null = [];
  procesandoImagen: boolean = false;

  constructor(
    private afAuth: AngularFireAuth, 
    private storage: StorageService, 
    private router: ActivatedRoute, 
    public route: Router 
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.dato = params['dato'];
    });

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.usuario = user.email;
        this.cargarImagenes();
      } else {
        console.log("null");
      }
    });

    Camera.requestPermissions();
  }

  async cargarImagenes() {
    this.imagenes = await this.storage.obtenerImagenesEnDirectorio('principal', this.dato);
  }

  cerrarSesion() {
    this.afAuth.signOut();
    this.route.navigateByUrl('login');
  }

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    if (image) {
      this.guardarImagen(image.base64String!);
    }
  }

  async guardarImagen(foto: string) {
    this.procesandoImagen = true;

    try {
      const fechaActual = new Date();
      const dia = fechaActual.getDate();
      const mes = fechaActual.getMonth() + 1;
      const anio = fechaActual.getFullYear();
      const hora = fechaActual.getHours();
      const minutos = fechaActual.getMinutes();
      const segundos = fechaActual.getSeconds();
      const milisegundos = fechaActual.getMilliseconds();
  
      const nombreArchivo = `${this.usuario}-${dia}${mes}${anio}${hora}${minutos}${segundos}${milisegundos}`;
      const fotoBase64 = foto;
      const dataURL = `data:image/jpeg;base64,${fotoBase64}`;
  
      await Filesystem.writeFile({
        path: nombreArchivo,
        data: dataURL,
        directory: Directory.Documents,
      });
  
      const urlDescarga = await this.storage.subirImagen(nombreArchivo, this.dato, dataURL);
  
      if (!urlDescarga) {
        this.procesandoImagen = false;
        Swal.fire({
          html: '<br><label style="font-size:80%">Error: No se pudo obtener la URL de descarga de la imagen</label>',
          confirmButtonText: "Ok",
          confirmButtonColor: 'var(--ion-color-primary)',
          heightAuto: false
        });
        return;
      }
  
      this.procesandoImagen = false;
      Swal.fire({
        html: '<br><label style="font-size:80%">Imagen guardada exitosamente</label>',
        confirmButtonText: "Ok",
        confirmButtonColor: 'var(--ion-color-primary)',
        heightAuto: false
      });

      this.cargarImagenes();
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
    }
  }

  accederVotacion() {
    const navigationExtras: NavigationExtras = {
      queryParams: { dato: this.dato }
    };
    this.route.navigate(['/votacion'], navigationExtras);
  }

  accederGraficos() {
    const navigationExtras: NavigationExtras = {
      queryParams: { dato: this.dato }
    };
    this.route.navigate(['/graficos'], navigationExtras);
  }
}