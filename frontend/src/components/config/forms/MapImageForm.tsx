/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from "react";
import { useFormContext, useFormState, useFieldArray, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Stack, Button, Dialog, DialogActions, DialogTitle, DialogContent, Typography } from "@mui/material";
import { Close, Map as MapIcon } from "@mui/icons-material";
import { useNotifications } from '@toolpad/core/useNotifications';
import { MapImageFormResponse } from "@/types/config";
import { FormProps } from "@/components/config/forms";
import { ImageResponse } from '@/components/map/MapImage';
import MapLayerPanel from "@/components/map/MapLayerPanel";
const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });
const MapImage = dynamic(() => import("@/components/map/MapImage"), { ssr: false });

// function ClearSelectionOnMapClick({ onClear }: { onClear: () => void }) {
//   useMapEvent('click', () => onClear());
//   return null;
// }

/**
 * 地図画像フォーム
 * @param name 設定名
 * @param form 設定内容
 * @param disabled 無効
 */
export default function MapImageForm({ name, form, disabled }: FormProps<MapImageFormResponse>) {
  const { control, getValues, setValue } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({ control, name });
  const { defaultValues } = useFormState({ control });
  const images:ImageResponse[] = useWatch({ control, name })
  const notifications = useNotifications();
  const translate = useTranslations("Config");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [files, setfiles] = useState<{file:File, url:string}[]>([]);
  const [open, setOpen] = useState(false);

  /** 画像更新 */
  useEffect(() => {
    let disposed = false  // StrictMode 防止

    const update = async () => {
      // 画像アップロード
      files.forEach(async ({file}) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`/api/files/map_images`, {
          method: 'PUT',
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? 'Failed to update image file');
        }
      })
      // 画像削除
      const imageNames = images.map((image) => image.name)
      const res = await fetch(`/api/files/map_images`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to get image file');
      if (disposed) return
      const data:string[] = await res.json();
      data
        .filter((file) => !imageNames.includes(file))
        .forEach(async (file) => {
          const res = await fetch(
            `/api/files/map_images?file=${encodeURIComponent(file)}`,
            { method: 'DELETE' }
          );
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error ?? 'Failed to delete image file');
          }
        })
    };
    update()
      .then(() => {
        files.forEach(({url}) => URL.revokeObjectURL(url))
        setfiles([])
      })
      .catch((error) => {
        notifications.show(translate("mapImage.error", {error}), {
          severity: 'error',
          autoHideDuration: 3000,
        })
      })
    return () => {
      disposed = true;
    };
  }, [defaultValues]);

  const idxById = useCallback(
    (id: string) => fields.findIndex(f => f.id === id),
    [fields]
  );

  const setCornersById = useCallback((id: string, corners: number[][]) => {
    const i = idxById(id);
    if (i >= 0) setValue(`${name}.${i}.corners`, corners, { shouldDirty: true });
  }, [idxById, setValue, name]);

  const handleReorder = useCallback(
    (from: number, to: number) => {
      if (from !== -1 && to !== -1 && from !== to) {
        move(from, to);
      }
    },
    [fields, move]
  );

  const handleToggleVisible = useCallback((id: string, next: boolean) => {
    const i = idxById(id);
    if (i >= 0) setValue(`${name}.${i}.visible`, next, { shouldDirty: true });
  }, [idxById, setValue, name]);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;
    // 同じファイル名は変更する
    const blob = file.slice(0, file.size, file.type);
    const pos = file.name.lastIndexOf(".")
    const name = file.name.slice(0,pos)
    const ext = file.name.slice(pos+1)
    for (let i = 1; images.find(image => image.name === file?.name); i++) {
      file = new File([blob], `${name} (${i}).${ext}`, {type: file.type});
    }
    append({
      name: file.name,
      visible: true,
      corners: undefined
    });
    setfiles(prev => [...prev, {file, url:URL.createObjectURL(file)}])
    e.target.value = "";
  };

  const handleDelete = useCallback((id: string) => {
    const i = idxById(id);
    if (i >= 0) remove(i);
    if (selectedId === id) setSelectedId(null);
  }, [idxById, remove, selectedId]);

  const indexById = new Map(fields.map((f, i) => [f.id, i] as const));

  return (
    <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
      <Button
        variant="outlined"
        startIcon={<MapIcon />}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {form.label}
      </Button>
      <Typography sx={{ whiteSpace: "pre-line" }}>
        {`${getValues(name).length}枚`}
      </Typography>

      {/* === 地図ダイアログ === */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>{form.label}</DialogTitle>

        {/* 高さは用途に応じて調整可能 */}
        <DialogContent sx={{ height: "600px", padding: 0 }}>
          <MapView
            {...getValues("default_view")}
            images={[]}
            style={{ width: "100%", height: "100%" }}
          >
            {/* <ClearSelectionOnMapClick onClear={() => setSelectedId(null)} /> */}
            {fields.map((item) => {
              const index = indexById.get(item.id) ?? -1;
              if (index < 0) return null;
              const image:ImageResponse = getValues(`${name}.${index}`)
              const file = files.find(({file}) => image.name === file.name)
              return (
                <MapImage
                  key={item.id}
                  id={item.id}
                  name={image.name}
                  visible={image.visible}
                  corners={image.corners}
                  editable
                  onCornersChange={(c) => setCornersById(item.id, c)}
                  onSelect={setSelectedId}
                  src={file ? file.url : undefined}
                  beforeId={index === 0 ? "overlay-anchor-layer" : `img-layer-${fields[index - 1].id}`}
                  selected={selectedId === item.id}
                />
              );
            })}
            <MapLayerPanel
              items={fields.map((f, i) => ({
                id: f.id,
                name: getValues(`${name}.${i}.name`),
                visible: getValues(`${name}.${i}.visible`),
              }))}
              selectedId={selectedId}
              onReorder={handleReorder}
              onToggleVisible={handleToggleVisible}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onSelect={setSelectedId}
              defaultOpen={false}
              offset={{ top: 12, right: 12 }}
              width={{ xs: 250, sm: 300 }}
              maxBodyHeight={420}
            />
          </MapView>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", padding: "8px 16px" }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Close />}
            onClick={() => setOpen(false)}
          >
            {translate("dialog.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

