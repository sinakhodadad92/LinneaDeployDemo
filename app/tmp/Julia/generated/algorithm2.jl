using LinearAlgebra.BLAS
using LinearAlgebra

"""
    algorithm2(ml12::Array{Float64,1}, ml13::Array{Float64,1}, ml14::Array{Float64,1})

Compute
alpha = (x^T z x^T y).

# Arguments
- `ml12::Array{Float64,1}`: Operand x of size 10.
- `ml13::Array{Float64,1}`: Operand z of size 10.
- `ml14::Array{Float64,1}`: Operand y of size 10.
"""                    
function algorithm2(ml12::Array{Float64,1}, ml13::Array{Float64,1}, ml14::Array{Float64,1})
    # cost: 41 FLOPs
    # x: ml12, full, z: ml13, full, y: ml14, full
    ml15 = Array{Float64}(undef, 1, 1)
    # tmp1 = (x^T z)
    ml15 = BLAS.dot(10, ml12, 1, ml13, 1)

    # x: ml12, full, y: ml14, full, tmp1: ml15, full
    ml16 = Array{Float64}(undef, 1, 1)
    # tmp3 = (x^T y)
    ml16 = BLAS.dot(10, ml12, 1, ml14, 1)

    # tmp1: ml15, full, tmp3: ml16, full
    ml17 = Array{Float64}(undef, 1, 1)
    # tmp8 = (tmp1 tmp3)
    ml17 = ml15 * ml16

    # tmp8: ml17, full
    # alpha = tmp8
    return (ml17)
end