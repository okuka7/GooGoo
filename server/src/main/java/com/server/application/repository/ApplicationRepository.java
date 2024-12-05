package com.server.application.repository;

import com.server.application.model.Application;
import com.server.post.model.Post;
import com.server.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByPost(Post post);
    boolean existsByPostAndApplicant(Post post, User applicant);
}

