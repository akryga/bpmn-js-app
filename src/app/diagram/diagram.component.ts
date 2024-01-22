import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Moddle } from 'moddle';
import {
  Reader,
  Writer
} from 'moddle-xml';
/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';

import { from, Observable, Subscription } from 'rxjs';
import { XmlLoaderService } from "../xmlloader.service"

@Component({
  selector: 'app-diagram',
  template: `
    <div #ref class="diagram-container"></div>
  `,
  styles: [
    `
      .diagram-container {
        height: 80vh;
        width: 100%;
      }
    `
  ]
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy, OnInit {


  @ViewChild('ref', { static: true }) private el: ElementRef;
  @Input() private url?: string;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();
  @Output() private eventBus: EventEmitter<any> = new EventEmitter();
  private bpmnJS: BpmnJS = new BpmnJS();
  

  events = [
    'element.hover',
    'element.out',
    'element.click',
    'element.dblclick',
    'element.mousedown',
    'element.mouseup'
  ];
  
  // public get bpmnJS(): BpmnJS {
  //   return this._bpmnJS;
  // }

  // public set bpmnJS(value: BpmnJS) {
  //   this._bpmnJS = value;
  // }

  constructor(private xmlLoader: XmlLoaderService ) {
    
    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.registerEvents();
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
  }

  registerEvents(){
    var eb = this.bpmnJS.get('eventBus');
    this.events.forEach(function(event) {
      eb.on(event, function(e) {
        // e.element = the model element
        // e.gfx = the graphical element
        console.log(event, 'on', e.element.id);
      });
    });
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  async getXml(): Promise<string>
  {
    try {
      const res = await this.bpmnJS.saveXML();
      const { xml } = res;
      return xml;
    } catch (error) {
      console.error(error);
    }
    return '';
  }

  ngOnInit(): void {
    if (this.url) {
      this.loadUrl(this.url);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
    }
    console.log(changes)
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(xmlFileName: string): Subscription {

    return (
      this.xmlLoader.getXml(xmlFileName).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          
          var canvas = this.bpmnJS.get('canvas');

          canvas.addMarker('a-2', 'highlight');
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<{warnings: Array<any>}> {
    return from(this.bpmnJS.importXML(xml) as Promise<{warnings: Array<any>}>);
  }
}
