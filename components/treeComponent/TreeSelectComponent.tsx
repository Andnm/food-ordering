import React, { Key, useState } from "react";
import { Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";

interface Props {
  treeData: DataNode[];
  checkedKeys: React.Key[];
  setCheckedKeys: (data: React.Key[]) => void;
}

const TreeSelectComponent: React.FC<Props> = (props) => {
  const { treeData, checkedKeys, setCheckedKeys } = props;

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    setCheckedKeys(checkedKeys as React.Key[]);
  };

  return (
    <Tree
      checkable
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      treeData={treeData}
    />
  );
};

export default TreeSelectComponent;
