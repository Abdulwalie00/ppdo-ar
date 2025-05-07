import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faChartBar,
  faCog,
  faChevronRight,
  faChevronDown,
  faFileAlt,
  faDatabase,
  faUsers, faCircle, faCaretRight, faCaretLeft, faCaretDown
} from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface MenuItem {
  title: string;
  icon: any;
  link?: string;
  isExpanded?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('slideDownUp', [
      state('closed', style({ height: '0px', overflow: 'hidden', opacity: 0 })),
      state('open', style({ height: '*', overflow: 'hidden', opacity: 1 })),
      transition('closed <=> open', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent {
  isCollapsed = signal(false);
  currentMenuTopPosition: number = 1;
  menuItems = signal<MenuItem[]>([
    {
      title: 'Dashboard',
      icon: faHome,
      link: '/dashboard'
    },
    {
      title: 'PGO',
      icon: faChartBar,
      isExpanded: false,
      children: [
        {
          title: 'PTCAO', link: '/pgo/ptcao',
          icon: faCircle
        },
        //PGO Pages
        { title: 'PDD', icon: faCircle, link: '/pgo/pdd' },
        { title: 'ICTO', icon: faCircle, link: '/pgo/icto' },
        { title: 'RYDO', icon: faCircle, link: '/pgo/rydo' },
        { title: 'PWO', icon: faCircle, link: '/pgo/pwo' },
        { title: 'PLPP', icon: faCircle, link: '/pgo/plpp' },
        { title: 'PTLDC', icon: faCircle, link: '/pgo/ptldc' },
        { title: 'LEDIPO', icon: faCircle, link: '/pgo/ledipo' },
        { title: 'GAD', icon: faCircle, link: '/pgo/gad' },
      ]
    },
    {
      title: 'OPVG',
      icon: faUsers,
      link: '/users'
    },
    {
      title: 'Implementing',
      icon: faDatabase,
      isExpanded: false,
      children: [
        { title: 'PEO', icon: faCircle, link: '/implementing/peo' },
        { title: 'PIO', icon: faCircle, link: '/implementing/pio' },
        { title: 'PCO', icon: faCircle, link: '/implementing/pco' },
        { title: 'OPAG', icon: faCircle, link: '/implementing/opag' },
        { title: 'PENRO', icon: faCircle, link: '/implementing/penro' },
        { title: 'PSWDO', icon: faCircle, link: '/implementing/pswdo' },
        { title: 'PHO', icon: faCircle, link: '/implementing/pho' },
        { title: 'PVO', icon: faCircle, link: '/implementing/pvo' },
      ]
    },
    {
      title: 'Administrative Support',
      icon: faDatabase,
      isExpanded: false,
      children: [
        { title: 'PPDO', icon: faFileAlt, link: '/administration-support/ppdo' },
        { title: 'PHRMO', icon: faDatabase, link: '/administration-support/phrmo' },
        { title: 'PGSO', icon: faFileAlt, link: '/administration-support/pgso' },
        { title: 'PTO', icon: faDatabase, link: '/administration-support/pto' },
        { title: 'PACCO', icon: faFileAlt, link: '/administration-support/pacco' },
        { title: 'PBO', icon: faDatabase, link: '/administration-support/pbo' },
        { title: 'PLSO', icon: faFileAlt, link: '/administration-support/plso' },
        { title: 'PSF', icon: faDatabase, link: '/administration-support/psf' },
      ]
    },
    {
      title: 'Settings',
      icon: faCog,
      link: '/settings'
    }
  ]);

  // FontAwesome icons
  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  faCaretRight = faCaretRight;
  faCaretLeft = faCaretLeft;
  faCaretDown = faCaretDown;

  toggleMenu(menuItem: MenuItem) {
    if (menuItem.children) {
      menuItem.isExpanded = !menuItem.isExpanded;
    }
  }

  // handleMenuClick(item: MenuItem, $event: MouseEvent) {
  //   if (this.isCollapsed()) {
  //     // When collapsed, just toggle the expanded state
  //     item.isExpanded = !item.isExpanded;
  //
  //     // Close other expanded menus
  //     this.menuItems().forEach(menu => {
  //       if (menu !== item && menu.isExpanded) {
  //         menu.isExpanded = false;
  //       }
  //     });
  //   } else {
  //     // When not collapsed, use the existing toggle behavior
  //     this.toggleMenu(item);
  //   }
  // }

  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());

    // Close all expanded menus when collapsing the sidebar
    if (this.isCollapsed()) {
      this.menuItems().forEach(menu => {
        if (menu.isExpanded) {
          menu.isExpanded = false;
        }
      });
    }
  }

  handleMenuClick(menuItem: MenuItem, event: MouseEvent) {
    if (this.isCollapsed()) {
      menuItem.isExpanded = !menuItem.isExpanded;
      if (menuItem.isExpanded) {
        this.calculateTopPosition(event);
      }
      event.stopPropagation();
    } else {
      this.toggleMenu(menuItem);
    }
  }

  calculateTopPosition(event: MouseEvent): void {
    const clickedButton = event.currentTarget as HTMLElement;
    const buttonRect = clickedButton.getBoundingClientRect();
    // Adjust this value if you have a header or other offset
    this.currentMenuTopPosition = buttonRect.top - 1; // 60 is approximate header height
  }

}
