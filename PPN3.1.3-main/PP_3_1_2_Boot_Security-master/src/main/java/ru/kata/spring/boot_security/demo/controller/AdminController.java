package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;


@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/")
    public String showUsers(Model model, @ModelAttribute("newUser") User newUser) {
        model.addAttribute("usersList", userService.getUsers());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User curUser = userService.getUserByEmail(auth.getName());
        model.addAttribute("curUser", curUser);
        model.addAttribute("rolesList", roleService.getAllRoles());
        return "main_page";
    }

    @GetMapping("/new")
    public String newUser(@ModelAttribute("user") User user, Model model) {
        model.addAttribute("rolesList", roleService.getAllRoles());
        return "new_user";
    }

    @PostMapping("/")
    public String addUser(@ModelAttribute("user") User user) {
        userService.addUser(user);
        return "redirect:/main/";
    }

    @GetMapping("/{id}/edit")
    public String editUser(Model model, @PathVariable("id") long id) {
        model.addAttribute("user", userService.getUserById(id));
        model.addAttribute("rolesList", roleService.getAllRoles());
        return "edit_user";
    }

    @PatchMapping("/main/")
    public String updateUser(@ModelAttribute("user") User user
            , @RequestParam(value = "new_pass") String newPass) {
        userService.editUser(user, newPass);
        return "redirect:/main/";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") long id) {
        userService.deleteUserById(id);
        return "redirect:/main/";
    }

}