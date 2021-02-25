import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { StatisticService } from '../../service/statistic.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css'],
  
})
export class StatisticComponent implements OnInit {

  constructor(
    private statisticService: StatisticService,
    private messageService: MessageService,
  ) { }

  chartChange = false;

  public yearLineChartData: ChartDataSets[] = [
    { data: [], label: 'Authorize' },
    { data: [], label: 'Unauthorize' },
  ];
  public pieChartData: number[] = [0, 0, 0];
  public monthLineChartData: ChartDataSets[] = [
    { data: [], label: "Authorize Access"},
    {data: [], label: "Unauthorize Access"}
  ];
  public pieChartLabels: Label[] = ['System', 'Facebook', "Google"];

  public yearLineChartLabels: Label[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  public monthLineChartLabels: Label[] = ['1', ' ', ' ', ' ', '5', ' ', ' ', ' ', ' ', '10', ' ', ' ', ' ', ' ', '15', ' ', ' ', ' ', ' ', '20', ' ', ' ', ' ', ' ', '25', ' ', ' ', ' ', ' ', '30'];
  
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        // {
        //   id: 'y-axis-1',
        //   position: 'right',
        //   gridLines: {
        //     color: 'rgba(255,0,0,0.3)',
        //   },
        //   ticks: {
        //     fontColor: 'red',
        //   }
        // }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: '',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public lineChartColors: Color[] = [
    // { // grey
    //   backgroundColor: 'rgba(148,159,177,0.2)',
    //   borderColor: 'rgba(148,159,177,1)',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // },
    // { // dark grey
    //   backgroundColor: 'rgba(77,83,96,0.2)',
    //   borderColor: 'rgba(77,83,96,1)',
    //   pointBackgroundColor: 'rgba(77,83,96,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(77,83,96,1)'
    // },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public pieChartColors = [
    {
      backgroundColor: ['#172B4D', '#5E72E4', '#FB6340'],
    },
  ];
  public lineChartLegend = true;
  public pieChartLegend = true;
  public lineChartType: ChartType = 'line';
  public pieChartType: ChartType = 'pie';
  public lineChartPlugins = [pluginAnnotations];
  public pieChartPlugins = [pluginDataLabels];
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  monthAuthorizeResponse = [];
  monthUnauthorizeResponse = [];
  yearAuthorizeResponse = [];
  yearUnauthorizeResponse = [];

  activeAccounts = 0;
  inactiveAccounts = 0;

  thisMonth = 0;
  growthRate = 0;

  ngOnInit(): void {
    var date:Date = new Date();

    this.statisticService.getAccessCountByMonth(date.getMonth()+ 1, date.getFullYear())
      .then(data =>{
        this.monthAuthorizeResponse = [];
        this.monthUnauthorizeResponse = [];
        //console.log(data)
        data.listAccess.forEach(element => {
          this.monthAuthorizeResponse.push(element.authorizeCount);
          this.monthUnauthorizeResponse.push(element.unauthorizeCount);
        });

        this.monthLineChartData[0].data = this.monthAuthorizeResponse;
        this.monthLineChartData[0].label = "Authorize Access";

        this.monthLineChartData[1].data = this.monthUnauthorizeResponse;
        this.monthLineChartData[1].label = "Unauthorize Access";
      })
      .catch(error=>{
        console.log(error)
      })

    this.statisticService.getAccessCountByYear(date.getFullYear())
      .then(data =>{
        this.yearAuthorizeResponse = [];
        this.yearUnauthorizeResponse = [];

        console.log(data)
        data.listAccess.forEach(element => {
          this.yearAuthorizeResponse.push(element.authorizeCount);
          this.yearUnauthorizeResponse.push(element.unauthorizeCount);
        });

        this.yearLineChartData[0].data = this.yearAuthorizeResponse;
        this.yearLineChartData[1].data = this.yearUnauthorizeResponse;

        this.yearLineChartData[0].label = "Authorize Access";
        this.yearLineChartData[1].label = "Unauthorize Access";
      })
      .catch(error =>{
        console.log(error)
      })

    this.statisticService.GetNumberOfActiveUsers()
      .then(data =>{
        this.activeAccounts = data.activeAccounts;
        this.inactiveAccounts = data.inactiveAccounts;
      })
      .catch(error => console.log(error))

    this.statisticService.getTheNumberOfNewUsersByMonth()
      .then(data =>{
        this.thisMonth = data.thisMonth;
        this.growthRate = data.growthRate;
      })
      .catch(error => console.log(error))

    this.statisticService.GetTheAccountNumberOfEachType()
      .then(data => {
        console.log(data);
        this.pieChartLabels = ['System', 'Facebook', "Google"];
        this.pieChartData = [data.system, data.facebook, data.google];
      })
      .catch(error => console.log(error))
  }

  changeStatistic = () => {
    this.chartChange = !this.chartChange
  }
  // public randomize(): void {
  //   for (let i = 0; i < this.lineChartData.length; i++) {
  //     for (let j = 0; j < this.lineChartData[i].data.length; j++) {
  //       this.lineChartData[i].data[j] = this.generateNumber(i);
  //     }
  //   }
  //   this.chart.update();
  // }

  // private generateNumber(i: number): number {
  //   return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  // }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  // public hideOne(): void {
  //   const isHidden = this.chart.isDatasetHidden(1);
  //   this.chart.hideDataset(1, !isHidden);
  // }

  // public pushOne(): void {
  //   this.lineChartData.forEach((x, i) => {
  //     const num = this.generateNumber(i);
  //     const data: number[] = x.data as number[];
  //     data.push(num);
  //   });
  //   this.lineChartLabels.push(`Label ${this.lineChartLabels.length}`);
  // }

  // public changeColor(): void {
  //   this.lineChartColors[2].borderColor = 'green';
  //   this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
  // }

  // public changeLabel(): void {
  //   this.lineChartLabels[2] = ['1st Line', '2nd Line'];
  // }
}
