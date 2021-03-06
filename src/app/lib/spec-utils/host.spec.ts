import { CommonModule } from '@angular/common'
import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  NgModule,
  OnInit, SimpleChange, SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

export const createHost = (childComp, props, moduleMerge: NgModule = {}) => {
  @Directive({
    selector: '[test-anchor]'
  })
  class TestAnchor {
    constructor(public viewRef: ViewContainerRef) {
    }
  }

  @Component({
    template: '<ng-template test-anchor></ng-template>'
  })
  class Host implements OnInit {
    @ViewChild(TestAnchor) anchor
    compRef: ComponentRef<any>

    constructor(private compFactory: ComponentFactoryResolver) {
    }

    ngOnInit() {
      const factory = this.compFactory.resolveComponentFactory(childComp)
      this.compRef = this.anchor.viewRef.createComponent(factory)
      this.setProps(props, true)
    }

    setProps(newProps, initialChange = false) {
      const changes = {} as SimpleChanges
      Object.keys(newProps).forEach(prop => {
        this.compRef.instance[prop] = newProps[prop]
        changes[prop] = new SimpleChange(this.compRef.instance[prop], newProps[prop], initialChange)
      })
      this.compRef.instance.ngOnChanges && this.compRef.instance.ngOnChanges(changes)
      this.compRef.changeDetectorRef.detectChanges()
    }
  }

  @NgModule({
    declarations: [Host, childComp, TestAnchor, ...(moduleMerge.declarations || [])],
    providers: [...(moduleMerge.providers || [])],
    imports: [CommonModule, BrowserModule, FormsModule, ReactiveFormsModule, ...(moduleMerge.imports || [])],
    entryComponents: [Host, childComp, ...(moduleMerge.entryComponents || [])]
  })
  class TestModule {
    static host = Host
  }

  return TestModule
}