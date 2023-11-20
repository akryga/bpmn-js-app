import { TestBed } from '@angular/core/testing';

import { XmlLoaderService } from './xmlloader.service';

describe('XmlLoaderService', () => {
  let service: XmlLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmlLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
