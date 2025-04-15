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
  faUsers, faCircle
} from '@fortawesome/free-solid-svg-icons';

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
          title: 'PTCAO', link: '/reports',
          icon: faCircle
        },
        { title: 'PDD', icon: faCircle, link: '/reports/performance' },
        { title: 'ICTO', icon: faCircle, link: '/reports/performance' },
        { title: 'RYDO', icon: faCircle, link: '/reports' },
        { title: 'PWO', icon: faCircle, link: '/reports/performance' },
        { title: 'PLPP', icon: faCircle, link: '/reports/performance' },
        { title: 'PTLDC', icon: faCircle, link: '/reports' },
        { title: 'LEDIPO', icon: faCircle, link: '/reports/performance' },
        { title: 'GAD', icon: faCircle, link: '/reports/performance' },
      ]
    },
    {
      title: 'OPVV',
      icon: faUsers,
      link: '/users'
    },
    {
      title: 'Implementing',
      icon: faDatabase,
      isExpanded: false,
      children: [
        { title: 'PEO', icon: faFileAlt, link: '/data/records' },
        { title: 'PIO', icon: faDatabase, link: '/data/archives' },
        { title: 'PCO', icon: faFileAlt, link: '/data/records' },
        { title: 'OPAG', icon: faDatabase, link: '/data/archives' },
        { title: 'PENRO', icon: faFileAlt, link: '/data/records' },
        { title: 'PSWDO', icon: faDatabase, link: '/data/archives' },
        { title: 'PDRRMO', icon: faFileAlt, link: '/data/records' },
        { title: 'PHO', icon: faDatabase, link: '/data/archives' },
        { title: 'PVO', icon: faDatabase, link: '/data/archives' }
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
}
