import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Route, ActivatedRoute } from '@angular/router';
import {Chart, TooltipItem } from 'chart.js/auto';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  
})
export class GraficosPage implements OnInit {

  @ViewChild('tortaCanvas') tortaCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barraCanvas') barraCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imagenDiv') imagenDiv!: ElementRef<HTMLCanvasElement>;

  dato: string | null = null;
  listaVotos: any[] = [];
  imagenes:any;
  constructor(private database: DatabaseService, public router: ActivatedRoute, private storage: StorageService) { }

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.dato = params['dato'];
    });

    this.database.obtenerTodos(`votos-${this.dato}`).then(firebaseResponse => {
      firebaseResponse?.subscribe(listaVotosRef => {
        this.listaVotos = listaVotosRef.map(votoRef => {
          let voto: any = votoRef.payload.doc.data();
          voto['id'] = votoRef.payload.doc.id;
          return voto;
        });

        if (this.dato == "linda") {
          this.inicializarGraficoTorta();
        } else if (this.dato == "fea") {
          console.log(this.dato);
          this.inicializarGraficoBarras();
        }
      });
    });

    //this.obtenerImagenes();
   
  }


  inicializarGraficoTorta() {
    const data = this.listaVotos.map(voto => voto.cantVotos);
    const labels = this.listaVotos.map(voto => ''); // Eliminar las etiquetas

    const tortaCtx = this.tortaCanvas.nativeElement.getContext('2d');

    if (tortaCtx) {
      const chart = new Chart(tortaCtx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: false // Deshabilitar los tooltips
            }
          }
        }
      });

      // Agregar evento de clic al gráfico de torta
      tortaCtx.canvas.addEventListener('click', (event) => {
        const activeSegments = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        if (activeSegments.length > 0) {
          const index = activeSegments[0].index;
          const voto = this.listaVotos[index];
          // Mostrar la imagen correspondiente al hacer clic en el segmento de la torta
          this.mostrarImagen(voto.url, voto.cantVotos);
        }
      });
    } else {
      console.error('El contexto del lienzo es nulo. No se puede crear el gráfico.');
    }
  }

  inicializarGraficoBarras() {
    const ctx = this.barraCanvas.nativeElement.getContext('2d');
    const data = this.listaVotos.map(voto => voto.cantVotos);
    const labels = this.listaVotos.map(voto => ''); // Eliminar las etiquetas

    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cantidad de Votos',
            data: data,
            backgroundColor: 'rgba(24, 49, 83, 1)', // Color de las barras
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true // Inicia el eje y en cero
            }
          }
        }
      });

      // Agregar evento de clic a las barras
      ctx.canvas.addEventListener('click', (event) => {
        const activeBars = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        if (activeBars.length > 0) {
          const index = activeBars[0].index;
          const voto = this.listaVotos[index];
          // Mostrar la imagen correspondiente al hacer clic en la barra
          this.mostrarImagen(voto.url, voto.cantVotos);
        }
      });
    } else {
      console.error('El contexto del lienzo es nulo. No se puede crear el gráfico.');
    }
  }

  // Función para mostrar la imagen correspondiente en el div
  mostrarImagen(url: string, cantVotos:any) {
    // Mostrar la imagen en el div
    this.imagenDiv.nativeElement.innerHTML = `<img src="${url}" height="200px" width="250px" > <h3>Esta imágen recibió ${cantVotos} votos</h3>`;


  }
}


