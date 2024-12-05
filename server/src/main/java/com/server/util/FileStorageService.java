package com.server.util;

import com.server.common.exception.FileStorageException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("파일 저장 디렉토리 초기화 완료: {}", this.fileStorageLocation.toString());
        } catch (Exception ex) {
            log.error("파일 디렉토리 생성 실패: {}", ex.getMessage());
            throw new FileStorageException("파일 디렉토리를 생성할 수 없습니다.");
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = StringUtils.getFilenameExtension(originalFileName);
        String newFileName = UUID.randomUUID().toString() + "." + fileExtension;

        try {
            if (originalFileName.contains("..")) {
                log.warn("부적합한 파일명 시도: {}", originalFileName);
                throw new FileStorageException("파일명에 부적합한 문자가 포함되어 있습니다: " + originalFileName, HttpStatus.BAD_REQUEST);
            }

            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("파일 저장 성공: {}", newFileName);
            return "/uploads/" + newFileName;
        } catch (IOException ex) {
            log.error("파일 저장 실패: {}", originalFileName, ex);
            throw new FileStorageException("파일 저장에 실패하였습니다: " + originalFileName);
        }
    }
}
