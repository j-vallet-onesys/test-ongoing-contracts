import { Component, VERSION, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  options$: Observable<any>;

  form = new FormGroup({
    legend: new FormControl<'none' | 'top' | 'right'>('right'),
    showLabel: new FormControl(false),
    minSize: new FormControl(40),
    maxSize: new FormControl(70),
    rounded: new FormControl(true),
    roseType: new FormControl<'none' | 'area' | 'angle'>('none'),
    showPercent: new FormControl(false),
    decimals: new FormControl(1),
  });

  ngOnInit(): void {
    const data = [
      {
        name: 'A2i ACTUAL CHOLET',
        value: 4,
      },
      {
        name: 'ACTUAL CHOLET',
        value: 5,
      },
      {
        name: 'ADECCO CHOLET R98',
        value: 8,
      },
      {
        name: 'ADECCO CHOLET SERVICES CY7',
        value: 12,
      },
      {
        name: 'MANPOWER CHOLET',
        value: 23,
      },
      {
        name: 'PARTNAIRE 49 CHOLET',
        value: 29,
      },
      {
        name: 'SITI CHOLET ',
        value: 1,
      },
      {
        name: 'STARTPEOPLE CHOLET',
        value: 19,
      },
      {
        name: 'SYNERGIE CHOLET NT',
        value: 9,
      },
      {
        name: 'SYNERGIE MAULEVRIER OJ',
        value: 2,
      },
      {
        name: 'SYNERGIE MORTAGNE RU',
        value: 3,
      },
      {
        name: 'SYNERGIE RH CDII 1B',
        value: 2,
      },
    ];
    const dataWithPercents = this.getData(data);

    const serie = {
      name: 'Fournisseur',
      type: 'pie',
      top: 35,
      avoidLabelOverlap: false,

      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold',
          width: 200,
        },
      },
      data: dataWithPercents,
    };

    this.options$ = this.form.valueChanges.pipe(
      startWith(this.form.value),
      map((form) => ({
        tooltip: {
          trigger: 'item',
          appendToBody: true,
        },
        title: {
          text: '117 Contrat(s) en cours',
          left: 'center',
        },
        ...this.getLegend(
          form.legend,
          form.showPercent,
          form.decimals,
          dataWithPercents
        ),
        series: [
          {
            ...serie,
            ...this.getPositionFromLegend(form.legend),
            ...this.getLabel(form.showLabel, form.showPercent, form.decimals),
            ...this.getSize(form.minSize, form.maxSize),
            ...this.getRounded(form.rounded),
            ...this.getRoseType(form.roseType),
          },
        ],
      }))
    );
  }

  getLegend(
    option: 'none' | 'top' | 'right',
    showPercent: boolean,
    decimals: number,
    data: any[]
  ) {
    switch (option) {
      case 'none':
        return {};
      case 'top':
        return {
          legend: {
            left: 'center',
            top: 20,
            type: 'scroll',
            formatter: this.getLegendFormatter(showPercent, decimals, data),
          },
        };
      case 'right':
        return {
          legend: {
            left: 'right',
            type: 'scroll',
            orient: 'vertical',
            formatter: this.getLegendFormatter(showPercent, decimals, data),
          },
        };
    }
  }

  getLegendFormatter(
    showPercent: boolean,
    decimals: number,
    originalData: any[]
  ) {
    if (!showPercent) {
      return (d) => d;
    }
    return (d) =>
      `${d} (${originalData
        .find((od) => od.name === d)
        .percent.toFixed(decimals)}%)`;
  }

  getPositionFromLegend(option: 'none' | 'top' | 'right') {
    if (option === 'right') {
      return {
        right: 200,
      };
    }
    return {};
  }

  getLabel(showLabel: boolean, showPercent: boolean, decimals: number) {
    console.log('label', showLabel);
    if (showLabel) {
      return {
        label: {
          show: true,
          formatter: this.getLabelFormater(showPercent, decimals),
        },
        labelLine: {
          show: true,
        },
      };
    }
    return {
      label: {
        show: false,
        position: 'center',
        formatter: this.getLabelFormater(showPercent, decimals),
      },
      labelLine: {
        show: false,
      },
    };
  }

  getLabelFormater(showPercent: boolean, decimals: number) {
    if (!showPercent) {
      return (d) => d.name;
    }
    return (d) => `${d.name} (${d.percent.toFixed(decimals)}%)`;
  }

  getSize(min: number, max: number) {
    return {
      radius: [`${min}%`, `${max}%`],
    };
  }

  getRounded(option: boolean) {
    if (!option) {
      return {};
    }
    return {
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
    };
  }

  getRoseType(option: 'none' | 'angle' | 'area') {
    if (option === 'none') {
      return {};
    }
    return {
      roseType: option,
    };
  }

  getData(originalData: Array<{ name: string; value: number }>) {
    const count = originalData.reduce((acc, itm) => acc + itm.value, 0);
    return originalData.map((d) => ({
      name: d.name,
      value: d.value,
      percent: (d.value * 100) / count,
    }));
  }
}
