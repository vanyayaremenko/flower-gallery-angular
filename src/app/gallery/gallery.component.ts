import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { GalleryService } from './gallery.service';
import { modalConstants } from './constants/constants';
import { Gallery } from './models/models';

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  images: Gallery[] = [];
  size: number = 0;
  currentIndex: number = 7;
  summaryTitle: string = '';
  summaryDescription: string = '';
  isSelectedImage: boolean = false;

  private minWidth: number = 1023;
  private minHeight: number = 600;
  private showingCount: number = 4;
  private cardNodes: HTMLElement[] = [];
  private modalImageNodes: HTMLElement[] = [];
  private modalPrevHiddenImageNodes: HTMLElement[] = [];
  private modalPrevShowingImageNodes: HTMLElement[] = [];
  private modalActiveImageNodes: HTMLElement[] = [];
  private modalNextShowingImageNodes: HTMLElement[] = [];
  private modalNextHiddenImageNodes: HTMLElement[] = [];

  modalSummaryContentCssClassName =
    modalConstants.modalSummaryContentCssClassName;
  modalCssClass = modalConstants.modalCssClassName;
  modalSummaryCssClassName = modalConstants.modalSummaryCssClassName;
  modalControlsCssClass = modalConstants.modalControlsCssClassName;
  modalImagesCssClassName = modalConstants.modalImagesCssClassName;
  modalTitleCssClassName = modalConstants.modalTitleCssClassName;
  modalDescriptionCssClassName = modalConstants.modalDescriptionCssClassName;
  modalImageCssClassName = modalConstants.modalImageCssClassName;
  modalCloseCssClassName = modalConstants.modalCloseCssClassName;
  modalNavsCssClassName = modalConstants.modalNavsCssClassName;
  modalNavCssClassName = modalConstants.modalNavCssClassName;
  modalNavPrevCssClassName = modalConstants.modalNavPrevCssClassName;
  modalNavNextCssClassName = modalConstants.modalNavNextCssClassName;
  modalCouterCssClassName = modalConstants.modalCouterCssClassName;

  @ViewChild('gallery') galleryElementRef: ElementRef | undefined;
  @ViewChild('modalContainer') modalContainerElementRef:
    | ElementRef<HTMLElement>
    | undefined;
  @ViewChild('modalSummary') modalSummaryElementRef: ElementRef | undefined;
  @ViewChild('modalSummaryContent') modalSummaryContentElementRef:
    | ElementRef
    | undefined;
  @ViewChild('modalControls') modalControlsNodeElementRef:
    | ElementRef
    | undefined;

  @ViewChildren('galleryCard', { read: ElementRef })
  galleryCardNodesElementsRef: ElementRef<HTMLElement>[] | undefined;
  @ViewChildren('modalImage', { read: ElementRef })
  modalImageNodesElementRef: ElementRef<HTMLElement>[] | undefined;

  constructor(
    private httpClient: HttpClient,
    private galleryService: GalleryService
  ) {}

  ngOnInit() {
    this.httpClient
      .get<Gallery[]>('../../assets/images-data.json')
      .subscribe((data) => {
        this.images = data;
      });
  }

  clickImage(index: number) {
    this.isSelectedImage = true;
    this.size = this.galleryCardNodesElementsRef!.length;
    this.currentIndex = index;
    this.setNodes();

    if (
      this.modalCssClass.includes(modalConstants.modalOpenedCssClassName) ||
      this.modalCssClass.includes(modalConstants.modalOpeningCssClassName)
    ) {
      return;
    }

    this.modalCssClass =
      modalConstants.modalCssClassName +
      ' ' +
      modalConstants.modalOpeningCssClassName;

    this.galleryService.fadeIn(
      this.modalContainerElementRef?.nativeElement!,
      () => {
        this.modalCssClass =
          modalConstants.modalCssClassName +
          ' ' +
          modalConstants.modalOpenedCssClassName;
        this.switchChanges(false);
      }
    );

    this.setInitSizesToImages();
    this.setInitPositionsToImages();
  }

  clickClose() {
    this.isSelectedImage = false;
    this.setInitPositionsToImages();
    this.modalImageNodesElementRef!.forEach((imageNode) => {
      imageNode.nativeElement.style.opacity = '1';
    });

    this.modalSummaryElementRef!.nativeElement.style.width = '0';
    this.modalControlsNodeElementRef!.nativeElement.style.marginTop = '3000px';

    this.galleryService.fadeOut(
      this.modalContainerElementRef!.nativeElement,
      () => {
        this.modalCssClass = modalConstants.modalCssClassName;
      }
    );
  }

  clickNext() {
    if (this.currentIndex < this.size - 1) {
      this.currentIndex += 1;
      this.switchChanges(true);
    }
  }

  clickPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      this.switchChanges(true);
    }
  }

  onResize() {
    if (this.isSelectedImage) {
      setTimeout(() => {
        this.setInitSizesToImages();
        this.setGalleryStyles();
      }, 250);
    }
  }

  private switchChanges(hasSummaryAnimation: boolean) {
    this.setCurrentState();
    this.changeSummary(hasSummaryAnimation);
  }

  private setInitSizesToImages() {
    this.cardNodes.forEach((cardNode, index) => {
      const data = cardNode.getBoundingClientRect();
      this.modalImageNodes[index].style.width = data.width + 'px';
      this.modalImageNodes[index].style.height = data.height + 'px';
    });
  }

  private setInitPositionsToImages() {
    this.cardNodes.forEach((cardNode, index) => {
      const data = cardNode.getBoundingClientRect();
      this.galleryService.setPositionStyles(
        this.modalImageNodes[index],
        data.left,
        data.top
      );
    });
  }

  private changeSummary(hasAnimation: boolean = false) {
    if (hasAnimation) {
      this.modalSummaryContentElementRef!.nativeElement.style.opacity = 0;

      setTimeout(() => {
        this.summaryDescription = this.images[this.currentIndex].description;
        this.summaryTitle = this.images[this.currentIndex].title;
        this.modalSummaryContentElementRef!.nativeElement.style.opacity = 1;
      }, 400);
    } else {
      this.summaryTitle = this.images[this.currentIndex].title;
      this.summaryDescription = this.images[this.currentIndex].description;
    }
  }

  private setNodes() {
    if (
      this.modalImageNodesElementRef &&
      this.modalImageNodes.length !== this.modalImageNodesElementRef.length
    ) {
      this.modalImageNodes = [];
      for (let image of this.modalImageNodesElementRef) {
        this.modalImageNodes.push(image.nativeElement);
      }
    }

    if (
      this.galleryCardNodesElementsRef &&
      this.cardNodes.length !== this.galleryCardNodesElementsRef.length
    ) {
      this.cardNodes = [];
      for (let card of this.galleryCardNodesElementsRef) {
        this.cardNodes.push(card.nativeElement);
      }
    }
  }

  private setCurrentState() {
    this.modalPrevHiddenImageNodes = [];
    this.modalPrevShowingImageNodes = [];
    this.modalActiveImageNodes = [];
    this.modalNextShowingImageNodes = [];
    this.modalNextHiddenImageNodes = [];

    this.modalImageNodes.forEach((imageNode, index) => {
      if (index + this.showingCount < this.currentIndex) {
        this.modalPrevHiddenImageNodes.unshift(imageNode);
      } else if (index < this.currentIndex) {
        this.modalPrevShowingImageNodes.unshift(imageNode);
      } else if (index === this.currentIndex) {
        this.modalActiveImageNodes.push(imageNode);
      } else if (index <= this.currentIndex + this.showingCount) {
        this.modalNextShowingImageNodes.push(imageNode);
      } else {
        this.modalNextHiddenImageNodes.push(imageNode);
      }
    });

    this.setGalleryStyles();
  }

  private setGalleryStyles() {
    const imageWidth = this.cardNodes[0].offsetWidth;
    const imageHeight = this.cardNodes[0].offsetHeight;
    const modalWidth = Math.max(this.minWidth, window.innerWidth);
    const modalHeight = Math.max(this.minHeight, window.innerHeight);

    this.modalPrevHiddenImageNodes.forEach((node) => {
      this.galleryService.setImageStyles(node, {
        top: -modalHeight,
        left: 0.29 * modalWidth,
        opacity: 0.1,
        zIndex: 1,
        scale: 0.4,
      });
    });

    this.galleryService.setImageStyles(this.modalPrevShowingImageNodes[0], {
      top: modalHeight - imageHeight,
      left: 0.25 * modalWidth,
      opacity: 0.4,
      zIndex: 4,
      scale: 0.75,
    });

    this.galleryService.setImageStyles(this.modalPrevShowingImageNodes[1], {
      top: 0.35 * modalHeight,
      left: 0.06 * modalWidth,
      opacity: 0.3,
      zIndex: 3,
      scale: 0.6,
    });

    this.galleryService.setImageStyles(this.modalPrevShowingImageNodes[2], {
      top: 0,
      left: 0.15 * modalWidth,
      opacity: 0.2,
      zIndex: 2,
      scale: 0.5,
    });

    this.galleryService.setImageStyles(this.modalPrevShowingImageNodes[3], {
      top: -0.3 * imageHeight,
      left: 0.29 * modalWidth,
      opacity: 0.1,
      zIndex: 1,
      scale: 0.4,
    });

    this.modalActiveImageNodes.forEach((node) => {
      this.galleryService.setImageStyles(node, {
        top: (modalHeight - imageHeight) / 2,
        left: (modalWidth - imageWidth) / 2,
        opacity: 1,
        zIndex: 5,
        scale: 1.2,
      });
    });

    this.galleryService.setImageStyles(this.modalNextShowingImageNodes[0], {
      top: 0,
      left: 0.52 * modalWidth,
      opacity: 0.4,
      zIndex: 4,
      scale: 0.75,
    });

    this.galleryService.setImageStyles(this.modalNextShowingImageNodes[1], {
      top: 0.12 * modalHeight,
      left: 0.73 * modalWidth,
      opacity: 0.3,
      zIndex: 3,
      scale: 0.6,
    });

    this.galleryService.setImageStyles(this.modalNextShowingImageNodes[2], {
      top: 0.46 * modalHeight,
      left: 0.67 * modalWidth,
      opacity: 0.2,
      zIndex: 2,
      scale: 0.5,
    });

    this.galleryService.setImageStyles(this.modalNextShowingImageNodes[3], {
      top: 0.67 * modalHeight,
      left: 0.53 * modalWidth,
      opacity: 0.1,
      zIndex: 1,
      scale: 0.4,
    });

    this.modalNextHiddenImageNodes.forEach((node) => {
      this.galleryService.setImageStyles(node, {
        top: modalHeight,
        left: 0.53 * modalWidth,
        opacity: 0.1,
        zIndex: 1,
        scale: 0.4,
      });
    });

    this.galleryService.setControlsStyles(
      this.modalControlsNodeElementRef?.nativeElement,
      (modalHeight - imageHeight * 1.2) / 2,
      imageHeight * 1.2
    );

    this.modalSummaryElementRef!.nativeElement.style.width = '45%';
  }
}
