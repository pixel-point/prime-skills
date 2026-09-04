# Visual Audit Thresholds

The runtime owns these versioned defaults. Do not relax them in a run artifact or compensate for a failure by changing a screenshot scale.

| Measurement                               | Allowed difference |
| ----------------------------------------- | -----------------: |
| Required node, text, control, icon, order |              exact |
| Element position or size                  |              `2px` |
| Section boundary or height                |              `4px` |
| Padding or gap                            |              `2px` |
| Border width or radius                    |              `1px` |
| Font family and weight                    |              exact |
| Font size or line height                  |              `1px` |
| Letter spacing                            |            `0.1px` |
| Text line count and wrapping              |              exact |
| Token-backed color                        |              exact |
| Perceptual raster diff outside masks      |               `1%` |

The pixel comparator tolerates small channel differences caused by normal anti-aliasing. It does not tolerate altered geometry, text wrapping, missing content, or broad color-field drift.

Passing screenshot pixels cannot clear a structural, geometry, typography, surface, runtime, or convergence violation.
