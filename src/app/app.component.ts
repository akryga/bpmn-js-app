import { Component, ViewChild } from '@angular/core';
import { DiagramComponent } from './diagram/diagram.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
logEvents($event: any) {
throw new Error('Method not implemented.');
}
  title = 'bpmn-js-angular';

  diagramUrl = '0.xml';
  importError?: Error;

  @ViewChild('diagram') diagram: DiagramComponent;
  
  form: FormGroup = new FormGroup({
    nxml: new FormControl('0.xml', Validators.required)
  });

  changeNxml(e){
    this.diagramUrl = e.target.value;
    console.log(e.target.value);
  }

  handleImported(event) {

    const {
      type,
      error,
      warnings
    } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }

  model_xml: string = '';
  async refresh(){

    this.model_xml = await this.diagram.getXml();
  }
  
  // async showBpmnCode()
  // {

  //   // console.log(this.diagram.bpmnJS);
  //   try {
  //     const result = await this.diagram.bpmnJS.saveXML();
  //     const { xml } = result;
  //     this.modXml = xml;
  //     console.log( this.modXml );
  //   } catch (err) {
  //     console.log(err);
  //   }

  // }

}
