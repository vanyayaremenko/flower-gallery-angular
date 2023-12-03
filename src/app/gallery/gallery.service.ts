import { Injectable } from '@angular/core';
import { ImageStyle } from './models/models';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  constructor() {}

  fadeIn(element: HTMLElement, callback: Function) {
    let animation: FrameRequestCallback;

    (animation = () => {
      let opacityValue = +element.style.opacity;
      if (opacityValue < 1) {
        opacityValue += 0.08;
        element.style.opacity = opacityValue.toString();
        window.requestAnimationFrame(animation);
        return;
      }

      if (callback) {
        callback();
      }
    })();
  }

  fadeOut(element: HTMLElement, callback: Function) {
    let animation: FrameRequestCallback;

    (animation = () => {
      let opacityValue = +element.style.opacity;
      if (opacityValue > 0) {
        opacityValue -= 0.03;
        element.style.opacity = opacityValue.toString();
        window.requestAnimationFrame(animation);
        return;
      }

      if (callback) {
        callback();
      }
    })();
  }

  setPositionStyles(element: HTMLElement, x: number, y: number) {
    element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(
      1
    )}px, 0)`;
  }

  setControlsStyles(element: HTMLElement, marginTop: number, height: number) {
    element.style.marginTop = marginTop + 'px';
    element.style.height = height + 'px';
  }

  setImageStyles(element: HTMLElement, imageStyle: ImageStyle) {
    if (element) {
      element.style.opacity = imageStyle.opacity.toString();
      element.style.transform = `translate3d(${imageStyle.left.toFixed(
        1
      )}px, ${imageStyle.top.toFixed(1)}px, 0) scale(${imageStyle.scale})`;
      element.style.zIndex = imageStyle.zIndex.toString();
    }
  }
}
