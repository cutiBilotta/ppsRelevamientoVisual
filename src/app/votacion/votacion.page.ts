import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Route, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DatabaseService } from '../services/database.service';

import Swal from 'sweetalert2'


@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.page.html',
  styleUrls: ['./votacion.page.scss'],
})



export class VotacionPage implements OnInit {
  

  dato: string | null = null;
  imagenes: any;
  userEmail: any;
  userId: any;
  listaUsuarios: any[] = [];
  listaVotos: any[] = [];
  usuarioActual: any;
  isDataLoaded: boolean = false;

  constructor(
    private storage: StorageService,
    private router: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.dato = params['dato'];
    });

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.userId = user.uid;
        this.loadData();
      }
    });
  }

  async loadData() {
    await this.obtenerUsuarios();
    await this.obtenerVotos();
    await this.obtenerYMostrarImagenes();
    this.usuarioActual = this.listaUsuarios.find(usuario => usuario.correo === this.userEmail);
    this.isDataLoaded = true;
  }

  async obtenerUsuarios() {
    return new Promise<void>((resolve, reject) => {
      this.database.obtenerTodos('usuarios').then(firebaseResponse => {
        firebaseResponse?.subscribe(listaUsuariosRef => {
          this.listaUsuarios = listaUsuariosRef.map(usuarioRef => {
            let usuario: any = usuarioRef.payload.doc.data();
            usuario['id'] = usuarioRef.payload.doc.id;
            return usuario;
          });
          resolve();
        }, reject);
      });
    });
  }

  async obtenerVotos() {
    return new Promise<void>((resolve, reject) => {
      this.database.obtenerTodos(`votos-${this.dato}`).then(firebaseResponse => {
        firebaseResponse?.subscribe(listaVotosRef => {
          this.listaVotos = listaVotosRef.map(votoRef => {
            let voto: any = votoRef.payload.doc.data();
            voto['id'] = votoRef.payload.doc.id;
            return voto;
          });
          resolve();
        }, reject);
      });
    });
  }

  async obtenerYMostrarImagenes() {
    try {
      this.imagenes = await this.storage.obtenerImagenesEnDirectorio("relevamiento", this.dato!);
      if (this.imagenes) {
        this.imagenes.forEach((imagen: any) => {
          const indiceGuion = imagen.nombre.indexOf('-');
          const nombreArchivo = indiceGuion !== -1 ? imagen.nombre.substring(0, indiceGuion) : imagen.nombre;
          imagen.nombre = nombreArchivo;
        });
      } else {
        console.error('No se encontraron imágenes en el directorio relevamiento.');
      }
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
    }
  }

  shouldShowEmitirVotoButton(): boolean {
    if (!this.usuarioActual) return false;
    if (this.dato === 'linda' && this.usuarioActual.votoLindo === false) return true;
    if (this.dato === 'fea' && this.usuarioActual.votoFeo === false) return true;
    return false;
  }

  async emitirVoto(imagenSeleccionada: string) {
    const usuarioActual = this.listaUsuarios.find((usuario: any) => usuario.correo === this.userEmail);
    if (usuarioActual) {
      if ((this.dato === "linda" && usuarioActual.votoLindo === false) || (this.dato === "fea" && usuarioActual.votoFeo === false)) {
        await this.actualizarUsuarioYVotos(imagenSeleccionada, usuarioActual);
       
        if(this.dato == "linda"){
          this.usuarioActual.votoLindo= true;
        }else{
          this.usuarioActual.votoFeo = true;
        }
        
      } else {
        Swal.fire({
          html: '<br><label style="font-size:80%">El usuario ya ha emitido su voto o no puede votar</label>',
          confirmButtonText: "Ok",
          confirmButtonColor: 'var(--ion-color-primary)',
          heightAuto: false
        });
      }
    } else {
      console.log('No se encontró el usuario actual en la base de datos');
    }
  }

  async actualizarUsuarioYVotos(imagenSeleccionada: string, usuarioActual: any) {
    let usuarioActualizado: any;

    try {
      if (this.dato == "linda") {
        usuarioActualizado = {
          correo: this.userEmail,
          password: usuarioActual.password,
          votoFeo: usuarioActual.votoFeo,
          votoLindo: true
        };
      } else if (this.dato == "fea") {
        usuarioActualizado = {
          correo: this.userEmail,
          password: usuarioActual.password,
          votoFeo: true,
          votoLindo: usuarioActual.votoLindo
        };
      }

      await this.database.actualizar("usuarios", usuarioActualizado, usuarioActual.id);
      await this.actualizarVotosDB(imagenSeleccionada);

      Swal.fire({
        html: '<br><label style="font-size:80%">Voto emitido con éxito</label>',
        confirmButtonText: "Ok",
        confirmButtonColor: 'var(--ion-color-primary)',
        heightAuto: false
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        heightAuto: false
      });
    }
  }

  async actualizarVotosDB(imagenSeleccionada: string) {
    let flag: boolean = false;

    for (const voto of this.listaVotos) {
      if (voto.url === imagenSeleccionada && !flag) {
        const cantVotos = voto.cantVotos + 1;
        const votoActualizado = {
          url: voto.url,
          cantVotos: cantVotos
        };

        await this.database.actualizar(`votos-${this.dato}`, votoActualizado, voto.id);
        flag = true;
      }
    }

    if (!flag) {
      const nuevoVoto = {
        url: imagenSeleccionada,
        cantVotos: 1
      };
      await this.database.crear(`votos-${this.dato}`, nuevoVoto);
    }
  }
}