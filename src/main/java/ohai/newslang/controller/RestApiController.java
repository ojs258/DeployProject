package ohai.newslang.controller;

import lombok.RequiredArgsConstructor;
import ohai.newslang.domain.Member;
import ohai.newslang.service.MemberService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1")
@RequiredArgsConstructor
public class RestApiController {

    private final MemberService memberService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping("admin/users")
    public List<Member> users(){
        return memberService.findAll();
    }

    @PostMapping("join")
    public String join(@RequestBody Member member) {
        member.setPassword(bCryptPasswordEncoder.encode(member.getPassword()));
        member.setRoles("ROLE_USER");
        member.setJoinDate(LocalDateTime.now());
        memberService.join(member);
        return "회원가입완료";
    }

    @GetMapping("user")
    public String user(){
        return "user";
    }

    @GetMapping("manager")
    public String manager(){
        return "manager";
    }

    @GetMapping("admin")
    public String admin(){
        return "admin";
    }
}
