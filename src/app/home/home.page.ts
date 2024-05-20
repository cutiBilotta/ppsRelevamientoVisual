import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras  } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public seleccion : string | null = null;
  public userEmail : string|null=null;

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userEmail = user.email;
      } else {
        console.log("null");
      }
    });
  }
  constructor(private router:Router, private afAuth : AngularFireAuth) {}
  
  
  async cerrarSesion() {
    // Reproducir el audio
    let audio = new Audio("../../assets/audios/cierre-sesion.mp3");
    audio.play();
  
    // Esperar 1500ms antes de continuar
    await this.delay(1500);
  
    // Cerrar la sesión y redirigir al usuario a la página de inicio de sesión
    await this.afAuth.signOut();
    this.router.navigateByUrl('login');
  }
  
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  seleccionCosasFeas(){

    const navigationExtras: NavigationExtras = {
      queryParams: { dato: "fea" }
    };
    this.router.navigate(['/relevamiento'], navigationExtras);

  }

  seleccionCosasLindas(){

    const navigationExtras: NavigationExtras = {
      queryParams: { dato: "linda" }
    };
    this.router.navigate(['/relevamiento'], navigationExtras);

  }
}
