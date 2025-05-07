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
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';

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
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = signal(false);

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

  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;

  toggleMenu(menuItem: MenuItem) {
    if (menuItem.children) {
      menuItem.isExpanded = !menuItem.isExpanded;
    }
  }

  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faCaretRight = faCaretRight;
  protected readonly faCaretLeft = faCaretLeft;
  protected readonly faCaretDown = faCaretDown;
}
