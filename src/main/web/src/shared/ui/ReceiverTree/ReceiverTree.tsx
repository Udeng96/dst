import styled from "styled-components";
import CheckboxTree, {Node} from 'react-checkbox-tree';
import {Scrollbar} from "react-scrollbars-custom";
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import {
    faCheckSquare,
    faChevronCircleDown,
    faChevronCircleRight,
    faFile,
    faFolder,
    faFolderOpen,
    faMinusSquare,
    faPlusSquare,
    faSquare
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useEffect, useRef, useState} from "react";
import useGroupStore from '@/entities/organization/useGroupStore';
import useOrganizationStore from '@/entities/organization/useOrganizationStore';
import useDepartmentStore from '@/entities/department/useDepartmentStore';
import useUserStore from '@/entities/user/useUserStore';
import {ECrudStatus, IReceiver} from "@/widgets/situation-transfer/SituationTransfer";
import {find} from "lodash-es";

interface IReceiverTree {
    findUserName: string,
    receivers: IReceiver[],
    setReceivers: (updater: IReceiver[] | ((prev: IReceiver[]) => IReceiver[])) => void,
    crudStatus: ECrudStatus
}

const ReceiverTree = ({receivers, setReceivers, crudStatus, findUserName}:IReceiverTree) => {
    const treeIcon = {
        check: <FontAwesomeIcon className="rct-icon rct-icon-check" icon={faCheckSquare}/>,
        uncheck: <FontAwesomeIcon className="rct-icon rct-icon-uncheck" icon={faSquare}/>,
        halfCheck: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon={faCheckSquare}/>,
        expandClose: <FontAwesomeIcon className="rct-icon rct-icon-expand-close fa-lg" icon={faChevronCircleRight}/>,
        expandOpen: <FontAwesomeIcon className="rct-icon rct-icon-expand-open fa-lg" icon={faChevronCircleDown}/>,
        expandAll: <FontAwesomeIcon className="rct-icon rct-icon-expand-all" icon={faPlusSquare}/>,
        collapseAll: <FontAwesomeIcon className="rct-icon rct-icon-collapse-all" icon={faMinusSquare}/>,
        parentClose: <FontAwesomeIcon className="rct-icon rct-icon-parent-close" icon={faFolder}/>,
        parentOpen: <FontAwesomeIcon className="rct-icon rct-icon-parent-open" icon={faFolderOpen}/>,
        leaf: <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" icon={faFile}/>
    }

    const groups = useGroupStore((s) => s.groups)
    const organizations = useOrganizationStore((s) => s.organizations)
    const departments = useDepartmentStore((s) => s.departments)
    const users = useUserStore((s) => s.users)

    // useEffect(() => {
    // }, [findUserName])

    const [receiverNodes, setReceiverNodes] = useState<Node[]>([])
    useEffect(() => {
        Array.isArray(groups) && groups.length > 0 &&
        Array.isArray(organizations) && organizations.length > 0 &&
        Array.isArray(departments) && departments.length > 0 &&
        Array.isArray(users) && users.length > 0 &&
        setReceiverNodes(groups.map(group => ({
            value: group.groupId,
            label: group.groupName,
            children: organizations.filter(organization => organization.groupId === group.groupId)
                .map(organization => ({
                    value: organization.organizationId,
                    label: organization.organizationName,
                    children: departments.filter(department => department.organizationId === organization.organizationId)
                        .map(department => ({
                            value: department.departmentId,
                            label: department.departmentName,
                            children: users.filter(user => user.departmentId === department.departmentId && (user.userName.indexOf(findUserName) !== -1 ))
                                .map(user => ({
                                    value: user.userId,
                                    label: user.userName,
                                }))
                        }))
                }))
        } as Node)))
    }, [groups, organizations, departments, users, findUserName])

    const [receiverExpanded, setReceiverExpanded] = useState<string[]>([])
    const [receiverChecked, setReceiverChecked] = useState<string[]>([])
    useEffect(()=>{
        if(receivers) {
            setReceiverChecked(receivers.filter(receiver => receiver.userId !== '').map(receiver => receiver.userId))
        }
    }, [receivers])
    useEffect(()=>{
        if(receiverChecked){
            //receivers에 추가
            receiverChecked.forEach(userId => {
                if(!receivers.filter(receiver => receiver.userId !=='').map(receiver => receiver.userId).includes(userId)){
                    const user = users.find(user => user.userId === userId)
                    if (!user) return
                    const receiver = {
                        userId: user.userId,
                        userName: user.userName,
                        cpNo: user.cpNo
                    } as IReceiver
                    setReceivers((receivers:IReceiver[]) => [...receivers, receiver])
                }
            })
            //receivers에서 삭제
            receivers.filter(receiver => receiver.userId !=='').map(receiver => receiver.userId).forEach(userId=>{
                if(!receiverChecked.includes(userId)){
                    setReceivers((receivers:IReceiver[]) => receivers.filter(receiver => receiver.userId !== userId))
                }
            })
        }
    }, [receiverChecked])
    return <StyledReceiverTreeContainer>
        <StyledTreeArea scrollbarWidth={0}>
            {crudStatus === ECrudStatus.read ?
                <CheckboxTree
                nodes={receiverNodes}
                checked={receiverChecked}
                expanded={receiverExpanded}
                onCheck={()=>{}}
                onExpand={setReceiverExpanded}
                iconsClass="fas"
                icons={treeIcon}
            /> :
                <CheckboxTree
                nodes={receiverNodes}
                checked={receiverChecked}
                expanded={receiverExpanded}
                onCheck={setReceiverChecked}
                onExpand={setReceiverExpanded}
                iconsClass="fas"
                icons={treeIcon}/>}
        </StyledTreeArea>
    </StyledReceiverTreeContainer>
}


const StyledTreeArea = styled(Scrollbar)`
  width: 100%;
  position: relative;

  & .
ScrollbarsCustom-Scroller,
  & .ScrollbarsCustom-Content {
    width: calc(100% - 3vw);
    height: calc(100% - 2.8vh);
    display: flex;
    flex-direction: column;

    border-radius: 0.625vw;
    padding: 1.4vh 1.5vw;
    background-color: #26262e;
    position: relative;

    -ms-overflow-style: none; /* IE and Edge */
  }

  & .ScrollbarsCustom-Scroller::-webkit-scrollbar {
    display: none;
  }

  & .ScrollbarsCustom-TrackY {
    background-color: transparent !important;
    width: 0.5vw !important;
    right: 1vw !important;
  }

  .rct-node-icon {
    color: #9c5eff;
  }

  .rct-title {
    font-size: 0.5vw;
    color: #e1e2f0;
    padding-left: 0.3vw;
  }

  .rct-icon-check {
    color: #9c5eff;
  }

  .rct-icon-uncheck,
  .rct-icon-half-check {
    color: #4d5975;
  }

  .rct-icon-expand-close,
  .rct-icon-expand-open {
    color: #9c5eff;
  }

  .rct-icon-parent-close,
  .rct-icon-parent-open,
  .rct-icon-leaf-close {
    color: #4d5975;
  }

  .rct-text {
    margin-bottom: 0.96vh;
  }


  .rct-checkbox {
    fill: #955eff;
    border-radius: 5px;
    color: #ffffff;
  }
`

const StyledReceiverTreeContainer = styled.aside`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export default ReceiverTree