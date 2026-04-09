package com.eseict.dst.service.group;

import com.eseict.dst.domain.entity.rino.Group;
import com.eseict.dst.repository.rino.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    public List<Group> getGroups() {
        return groupRepository.findAll();
    }
}
