import { Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MdFamilyRestroom } from "react-icons/md";

// Menu items.
const items = [
  {
    title: "Accueil",
    url: "/home",
    icon: Home,
  },
  {
    title: "Famille",
    url: "/home/families",
    icon: MdFamilyRestroom,
  },
];

const SideBar = () => {
  return (
    <Sidebar>
      <SidebarContent className={"flex flex-col justify-between"}>
        <SidebarGroup>
          <SidebarGroupLabel>Mon espace Famille</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <Button>Déconnexion</Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
