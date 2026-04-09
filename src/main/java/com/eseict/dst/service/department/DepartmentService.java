package com.eseict.dst.service.department;

import com.eseict.dst.domain.entity.rino.Department;
import com.eseict.dst.repository.rino.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Department> getDepartments() {
        return departmentRepository.findAll();
    }
}
