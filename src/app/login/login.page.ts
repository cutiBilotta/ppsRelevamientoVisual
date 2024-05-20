import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  usuario= {
    correo:"",
    password:""
  }

  mensaje : string = "";
  mostrarSpinner : boolean= false;
  listaUsuarios: any[] = [];
  constructor(private database: DatabaseService, public router: Router, private afAuth: AngularFireAuth){

  }

  ngOnInit(): void {
    this.database.obtenerTodos('usuarios').then(firebaseResponse => {
      firebaseResponse?.subscribe(listaUsuariosRef => {
        this.listaUsuarios = listaUsuariosRef.map(usuarioRef => {
          let usuario: any = usuarioRef.payload.doc.data();
          usuario['id'] = usuarioRef.payload.doc.id;

          return usuario;
        })

      })

    })

  }

  async verificarUsuarioExistente() {
    this.mostrarSpinner = true; // Mostrar el spinner
    
    setTimeout(async () => {
      try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(this.usuario.correo, this.usuario.password);
        // El usuario ha iniciado sesión correctamente
        this.usuario.correo = "";
        this.usuario.password = "";
        this.router.navigateByUrl('home');
      } catch (error) {
        // Ocurrió un error durante el inicio de sesión
        console.log(this.usuario.correo, this.usuario.password);
        console.error('Error al iniciar sesión:', error);
        Swal.fire({
          html:
            '<br><label style="font-size:80%">Datos inválidos</label>',
          confirmButtonText: "Ok",
          confirmButtonColor: 'var(--ion-color-primary)',
          heightAuto: false
  
        })      } finally {
        this.mostrarSpinner = false; // Ocultar el spinner después de 2000 ms
      }
    }, 2000);
  }


  autocompletarUsurio1(){

    this.usuario.correo = "admin@admin.com";
    this.usuario.password = "111111";

  }
  autocompletarUsurio2(){

    this.usuario.correo = "invitado@invitado.com";
    this.usuario.password = "222222";
  }
  autocompletarUsurio3(){

    this.usuario.correo = "usuario@usuario.com";
    this.usuario.password = "333333";
  }
}
