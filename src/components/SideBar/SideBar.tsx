import { Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FaUser } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { MdFamilyRestroom } from "react-icons/md";

// Menu items.
const famileItems = [
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

const monEspaceItems = [
  {
    title: "Mon profil",
    url: "/home/profile",
    icon: FaUser,
  },
  {
    title: "Mes notifications",
    url: "/home/profile/notifications",
    icon: IoIosNotifications,
  },
];

const SideBar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={"uppercase"}>Famille</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {famileItems.map((item) => (
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
        <SidebarGroup>
          <SidebarGroupLabel className={"uppercase"}>
            Mon espace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {monEspaceItems.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
