import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model = [
    {
      label: 'Home',
      items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }],
    },
    {
      label: 'UI Components',
      items: [
        {
          label: 'Input',
          icon: 'pi pi-fw pi-check-square',
          to: '/uikit/input',
        },

        {
          label: 'Button',
          icon: 'pi pi-fw pi-mobile',
          to: '/uikit/button',
          class: 'rotated-icon',
        },
        { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },

        { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
      ],
    },

    {
      label: 'Pages',
      icon: 'pi pi-fw pi-briefcase',
      to: '/pages',
      items: [
        {
          label: 'Landing',
          icon: 'pi pi-fw pi-globe',
          to: '/landing',
        },
        {
          label: 'Auth',
          icon: 'pi pi-fw pi-user',
          items: [
            {
              label: 'Login',
              icon: 'pi pi-fw pi-sign-in',
              to: '/auth/login',
            },
          ],
        },
        {
          label: 'Crud',
          icon: 'pi pi-fw pi-pencil',
          to: '/pages/crud',
        },
      ],
    },
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item.seperator ? (
            <AppMenuitem
              item={item}
              root={true}
              index={i}
              key={item.label}
            />
          ) : (
            <li className="menu-separator"></li>
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
