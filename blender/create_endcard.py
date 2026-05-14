import bpy
import math
import os


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) / 255.0 for i in (0, 2, 4))


def clean_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for coll in list(bpy.data.collections):
        if coll.name not in ("Collection", "Scene Collection"):
            bpy.data.collections.remove(coll)
    for block in bpy.data.meshes:
        bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        bpy.data.materials.remove(block)
    for block in bpy.data.curves:
        bpy.data.curves.remove(block)
    for block in bpy.data.cameras:
        bpy.data.cameras.remove(block)
    for block in bpy.data.lights:
        bpy.data.lights.remove(block)


def load_system_font():
    paths = [
        "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\seguiemj.ttf",
        "/System/Library/Fonts/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for fp in paths:
        if os.path.exists(fp):
            try:
                return bpy.data.fonts.load(fp)
            except Exception:
                pass
    return None


def iter_fcurves(obj):
    """Yield fcurves from object/data animation data (works on Blender 4.x and 5.x)."""
    ad = obj.animation_data if hasattr(obj, 'animation_data') else None
    if not ad or not ad.action:
        return
    action = ad.action
    # Blender 4.x and earlier
    if hasattr(action, 'fcurves'):
        for fc in action.fcurves:
            yield fc
        return
    # Blender 5.x: action.layers[].strips[].channelbags[].fcurves
    for layer in action.layers:
        for strip in layer.strips:
            for cb in strip.channelbags:
                for fc in cb.fcurves:
                    yield fc


# =====================================================================
# SCENE SETUP
# =====================================================================
scene = bpy.context.scene
scene.frame_start = 600
scene.frame_end = 750
scene.render.engine = "CYCLES"
scene.cycles.samples = 128
scene.cursor.location = (0, 0, 0)

clean_scene()

# World — solid white
world = scene.world
if not world:
    world = bpy.data.worlds.new("World")
    scene.world = world
world.use_nodes = True
bg_node = world.node_tree.nodes.get("Background")
bg_node.inputs[0].default_value = (1.0, 1.0, 1.0, 1.0)
bg_node.inputs[1].default_value = 1.0

# =====================================================================
# FRONT-FACING ORTHOGRAPHIC CAMERA
# =====================================================================
bpy.ops.object.camera_add(location=(0, 0, -5))
cam = bpy.context.active_object
cam.name = "EndcardCamera"
cam.data.type = "ORTHO"
cam.data.ortho_scale = 3.8

target = bpy.data.objects.new("CamTarget", None)
bpy.context.collection.objects.link(target)
target.location = (0, 0, 0)
target.hide_viewport = True
target.hide_render = True

con = cam.constraints.new("TRACK_TO")
con.target = target
con.track_axis = "TRACK_NEGATIVE_Z"
con.up_axis = "UP_Y"

scene.camera = cam

# =====================================================================
# LIGHTS
# =====================================================================
bpy.ops.object.light_add(type="AREA", location=(3, 2.5, 2.5))
key = bpy.context.active_object
key.name = "KeyLight"
key.data.energy = 500
key.data.size = 5

bpy.ops.object.light_add(type="AREA", location=(-2.5, -1.5, -1.5))
fill = bpy.context.active_object
fill.name = "FillLight"
fill.data.energy = 150
fill.data.size = 3

# =====================================================================
# MATERIALS
# =====================================================================

# --- Icon gradient: #E8590A → #A83A00 ---
mat_icon = bpy.data.materials.new("IconGradient")
mat_icon.use_nodes = True
n = mat_icon.node_tree.nodes
l = mat_icon.node_tree.links
n.clear()

o = n.new("ShaderNodeOutputMaterial")
p = n.new("ShaderNodeBsdfPrincipled")
coord = n.new("ShaderNodeTexCoord")
map_node = n.new("ShaderNodeMapping")
grad = n.new("ShaderNodeTexGradient")
ramp = n.new("ShaderNodeValToRGB")

grad.gradient_type = "LINEAR"
c1 = hex_to_rgb("#E8590A")
c2 = hex_to_rgb("#A83A00")
ramp.color_ramp.elements[0].color = (*c1, 1.0)
ramp.color_ramp.elements[1].color = (*c2, 1.0)
map_node.inputs["Rotation"].default_value[2] = math.radians(45)

l.new(coord.outputs["Object"], map_node.inputs["Vector"])
l.new(map_node.outputs["Vector"], grad.inputs["Vector"])
l.new(grad.outputs["Fac"], ramp.inputs["Fac"])
l.new(ramp.outputs["Color"], p.inputs["Base Color"])
p.inputs["Roughness"].default_value = 0.35
l.new(p.outputs["BSDF"], o.inputs["Surface"])

# --- Silver metal for magnifying glass ---
mat_metal = bpy.data.materials.new("MagGlassMetal")
mat_metal.use_nodes = True
nm = mat_metal.node_tree.nodes
lm = mat_metal.node_tree.links
nm.clear()
pm = nm.new("ShaderNodeBsdfPrincipled")
om = nm.new("ShaderNodeOutputMaterial")
pm.inputs["Base Color"].default_value = (0.85, 0.85, 0.88, 1.0)
pm.inputs["Metallic"].default_value = 1.0
pm.inputs["Roughness"].default_value = 0.2
lm.new(pm.outputs["BSDF"], om.inputs["Surface"])

# --- Transparent black shadow ---
mat_shadow = bpy.data.materials.new("Shadow")
mat_shadow.use_nodes = True
mat_shadow.blend_method = "BLEND"
ns = mat_shadow.node_tree.nodes
ls = mat_shadow.node_tree.links
ns.clear()
ps = ns.new("ShaderNodeBsdfPrincipled")
os_ = ns.new("ShaderNodeOutputMaterial")
ps.inputs["Base Color"].default_value = (0, 0, 0, 1)
ps.inputs["Alpha"].default_value = 0.25
ps.inputs["Roughness"].default_value = 1.0
ls.new(ps.outputs["BSDF"], os_.inputs["Surface"])

# --- Bright white for text ---
mat_white = bpy.data.materials.new("WhiteText")
mat_white.use_nodes = True
nw = mat_white.node_tree.nodes
lw = mat_white.node_tree.links
nw.clear()
pw = nw.new("ShaderNodeBsdfPrincipled")
ow = nw.new("ShaderNodeOutputMaterial")
pw.inputs["Base Color"].default_value = (1, 1, 1, 1)
lw.new(pw.outputs["BSDF"], ow.inputs["Surface"])

# =====================================================================
# FONT
# =====================================================================
font = load_system_font()

# =====================================================================
# 1. ROUNDED SQUARE ICON (2x2, corner r=0.3)
# =====================================================================
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
icon = bpy.context.active_object
icon.name = "AppIcon"
icon.scale = (1, 1, 0.05)
bpy.ops.object.transform_apply(scale=True)

bev = icon.modifiers.new("Bevel", "BEVEL")
bev.width = 0.3
bev.segments = 16
bev.limit_method = "ANGLE"
bev.angle_limit = math.radians(30)
icon.data.materials.append(mat_icon)

# =====================================================================
# 2. SHADOW PLANE (subtle, below icon)
# =====================================================================
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, -0.15, -0.06))
shadow = bpy.context.active_object
shadow.name = "Shadow"
shadow.scale = (1.08, 1.08, 0.02)
bpy.ops.object.transform_apply(scale=True)
bev_s = shadow.modifiers.new("Bevel", "BEVEL")
bev_s.width = 0.3
bev_s.segments = 12
bev_s.limit_method = "ANGLE"
bev_s.angle_limit = math.radians(30)
shadow.data.materials.append(mat_shadow)

# =====================================================================
# 3. MAGNIFYING GLASS (centered on icon)
# =====================================================================
bpy.ops.mesh.primitive_torus_add(
    location=(0, 0, 0.12),
    major_radius=0.45,
    minor_radius=0.05,
    major_segments=40,
    minor_segments=16,
)
ring = bpy.context.active_object
ring.name = "MagGlass_Ring"
ring.data.materials.append(mat_metal)

bpy.ops.mesh.primitive_cylinder_add(
    vertices=12, radius=0.045, depth=0.55, location=(0.19, -0.64, 0.12)
)
handle = bpy.context.active_object
handle.name = "MagGlass_Handle"
handle.rotation_euler = (0, 0, math.radians(45))
handle.data.materials.append(mat_metal)

# =====================================================================
# 4. RUPEE TEXT "₹" inside magnifying glass
# =====================================================================
bpy.ops.object.text_add(location=(0, 0, 0.22))
rupee = bpy.context.active_object
rupee.name = "RupeeText"
rupee.data.body = "\u20B9"
rupee.data.align_x = "CENTER"
rupee.data.align_y = "CENTER"
rupee.data.size = 0.48
rupee.data.extrude = 0.025
rupee.data.bevel_depth = 0.005
rupee.data.bevel_resolution = 4
if font:
    rupee.data.font = font
    try:
        rupee.data.font_bold = font
    except Exception:
        pass
rupee.data.materials.append(mat_white)

# =====================================================================
# 5. "PriceSpy India" TITLE TEXT (below icon)
# =====================================================================
bpy.ops.object.text_add(location=(0, -1.55, 0.1))
title = bpy.context.active_object
title.name = "TitleText"
title.data.body = ""
title.data.align_x = "CENTER"
title.data.align_y = "CENTER"
title.data.size = 0.32
title.data.extrude = 0.015
title.data.bevel_depth = 0.003
title.data.bevel_resolution = 3
if font:
    title.data.font = font
title.data.materials.append(mat_white)

# =====================================================================
# 6. PARENT EMPTY (controls group animation)
# =====================================================================
bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
parent = bpy.context.active_object
parent.name = "IconGroup"

for obj in (icon, shadow, ring, handle, rupee, title):
    if obj:
        obj.parent = parent

# =====================================================================
# ANIMATION 1: Bounce-in scale (frames 600-660)
# =====================================================================
# keyframes: 0 → overshoot 1.2 → settle 0.95 → 1.0
parent.scale = (0, 0, 0)
parent.keyframe_insert(data_path="scale", frame=600)

parent.scale = (0, 0, 0)
parent.keyframe_insert(data_path="scale", frame=600)

parent.scale = (1.2, 1.2, 1.2)
parent.keyframe_insert(data_path="scale", frame=648)

parent.scale = (0.93, 0.93, 0.93)
parent.keyframe_insert(data_path="scale", frame=656)

parent.scale = (1.0, 1.0, 1.0)
parent.keyframe_insert(data_path="scale", frame=660)

# Set interpolation: BACK easing for bounce feel
for fc in iter_fcurves(parent):
    if fc.data_path == "scale":
        for kf in fc.keyframe_points:
            if kf.co.x == 600:
                kf.interpolation = "LINEAR"
            else:
                kf.interpolation = "BACK"
                kf.back = 0.5

# =====================================================================
# ANIMATION 2: "PriceSpy India" letter-by-letter (frames 660-700)
# =====================================================================
# Note: TextCurve.body is not keyframeable in Blender 5.x, so we use
# a frame-change handler to update the body per frame.
TITLE_FULL = "PriceSpy India"
TITLE_START = 660
TITLE_END = 700
TITLE_N_CHARS = len(TITLE_FULL)
title.data.body = ""

def _title_handler(scene):
    f = scene.frame_current
    if f < TITLE_START:
        title.data.body = ""
    elif f >= TITLE_END:
        title.data.body = TITLE_FULL
    else:
        idx = int((f - TITLE_START) / (TITLE_END - TITLE_START) * TITLE_N_CHARS)
        title.data.body = TITLE_FULL[:idx]

bpy.app.handlers.frame_change_post.append(_title_handler)
bpy.app.handlers.render_init.append(_title_handler)

# =====================================================================
# ANIMATION 3: Gentle floating (Y offset ±0.08, loop)
# =====================================================================
parent.location = (0, 0, 0)
parent.keyframe_insert(data_path="location", frame=600)

# Sine wave samples every 5 frames, period = 30 frames
for i in range(20):
    fr = 660 + i * 5
    off = 0.08 * math.sin(fr * 2 * math.pi / 30)
    parent.location = (0, off, 0)
    parent.keyframe_insert(data_path="location", frame=fr)

# Smooth bezier handles
for fc in iter_fcurves(parent):
    if fc.data_path == "location":
        for kf in fc.keyframe_points:
            if kf.co.x >= 660:
                kf.handle_left_type = "AUTO"
                kf.handle_right_type = "AUTO"

# =====================================================================
# FINISH
# =====================================================================
bpy.ops.object.select_all(action="DESELECT")
parent.select_set(True)
bpy.context.view_layer.objects.active = parent
scene.frame_current = 600

print("=" * 50)
print("PriceSpy India — Endcard Scene Created")
print("=" * 50)
print(f"  Frame range:    {scene.frame_start} – {scene.frame_end}")
print(f"  Objects:        {len(scene.objects)}")
print(f"  Camera:         {cam.name} (ortho)")
print(f"  Icon bounce:    frames 600 – 660")
print(f"  Letter reveal:  frames 660 – 700")
print(f"  Floating loop:  frames 660+  (Y ±0.08)")
print(f"\n  File:           {bpy.data.filepath if bpy.data.filepath else '(not saved)'}")
print("=" * 50)
