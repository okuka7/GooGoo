package com.server.repository;

import com.server.model.Application;
import com.server.model.Post;
import com.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByPost(Post post);
    boolean existsByPostAndApplicant(Post post, User applicant);
    List<Application> findByPostId(Long postId);
}

